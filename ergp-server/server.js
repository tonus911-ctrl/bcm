/* =====================================================================
   ERGP Server · v1 · 2026-08-10
   Мост между обычным веб-сервером Node.js и кодом курса worker.js.

   Зачем так. Код курса написан для Cloudflare и работает с двумя вещами,
   которых на обычном сервере нет: хранилище KV и объекты Request/Response.
   Вместо того чтобы переписывать курс заново (и получить два расходящихся
   варианта), мы подсовываем ему подделки:
     - KV подменяется папкой на диске, ключ = имя файла;
     - Request/Response в Node 18 и новее уже есть, они встроены.
   Благодаря этому worker.js остается почти буква в букву тем же, что
   работает в Cloudflare, и поведение курса не меняется.
   ===================================================================== */

const http  = require("http");
const fs    = require("fs");
const path  = require("path");
const spawn = require("child_process").spawn;

const DATA_DIR = process.env.ERGP_DATA || "/opt/ergp/data";
const PORT     = parseInt(process.env.ERGP_PORT || "8080", 10);
const ADMIN_KEY= process.env.ADMIN_KEY || "";

/* ---------- хранилище: папка вместо KV ---------- */
// Ключи вида "student:abc" превращаются в файлы "student__abc"
function keyToFile(key){
  return path.join(DATA_DIR, String(key).replace(/[^A-Za-z0-9._:-]/g, "_").replace(/:/g, "__"));
}

const KV = {
  async get(key, type){
    try {
      const buf = await fs.promises.readFile(keyToFile(key));
      const txt = buf.toString("utf8");
      return type === "json" ? JSON.parse(txt) : txt;
    } catch(e){ return null; }
  },
  async put(key, value){
    await fs.promises.mkdir(DATA_DIR, {recursive: true});
    const body = typeof value === "string" ? value : JSON.stringify(value);
    const file = keyToFile(key);
    const tmp  = file + ".tmp";
    // пишем во временный файл и переименовываем: так запись атомарна
    // и внезапное отключение питания не оставит half-written файл
    await fs.promises.writeFile(tmp, body, "utf8");
    await fs.promises.rename(tmp, file);
  },
  async delete(key){
    try { await fs.promises.unlink(keyToFile(key)); } catch(e){}
  },
  async list(opts){
    const prefix = (opts && opts.prefix) || "";
    let names = [];
    try { names = await fs.promises.readdir(DATA_DIR); } catch(e){ names = []; }
    const keys = names
      .filter(n => !n.endsWith(".tmp"))
      .map(n => n.replace(/__/g, ":"))
      .filter(k => k.startsWith(prefix))
      .sort()
      .map(k => ({name: k}));
    return {keys, list_complete: true, cursor: ""};
  }
};

const worker = require("./worker.js");

/* ---------- выгрузка резервной копии ----------
   GET /api/admin/backup?key=<ADMIN_KEY>
   Отдает СВЕЖИЙ архив всей папки данных: карточки студентов, прогресс,
   счетчик номеров и сам файл курса. Этого архива достаточно, чтобы
   восстановить курс с нуля на чистом сервере: install.sh + распаковка.
   Архив собирается на лету, ничего лишнего на диске не остается.        */
function tryBackup(req, res, url){
  if (url.pathname !== "/api/admin/backup") return false;
  const key = url.searchParams.get("key");
  if (!ADMIN_KEY || key !== ADMIN_KEY){
    res.writeHead(403, {"Content-Type": "application/json; charset=utf-8"});
    res.end('{"err":"auth"}');
    return true;
  }
  const day = new Date().toISOString().slice(0, 10);
  res.writeHead(200, {
    "Content-Type": "application/gzip",
    "Content-Disposition": 'attachment; filename="ergp-backup-' + day + '.tar.gz"',
    "Cache-Control": "no-store"
  });
  const tar = spawn("tar", ["-czf", "-", "-C", path.dirname(DATA_DIR), path.basename(DATA_DIR)]);
  tar.stdout.pipe(res);
  tar.stderr.on("data", function(){});
  tar.on("error", function(){ try { res.end(); } catch(e){} });
  return true;
}

/* ---------- мост: запрос Node -> Request -> worker -> ответ Node ---------- */
const server = http.createServer(async (req, res) => {
  try {
    {
      const u = new URL(req.url, "http://localhost");
      if (tryBackup(req, res, u)) return;
    }
    const proto = (req.headers["x-forwarded-proto"] || "http").split(",")[0].trim();
    const host  = (req.headers["x-forwarded-host"] || req.headers.host || "localhost").split(",")[0].trim();
    const url   = proto + "://" + host + req.url;

    const headers = new Headers();
    for (const [k, v] of Object.entries(req.headers)){
      if (Array.isArray(v)) v.forEach(x => headers.append(k, x));
      else if (v !== undefined) headers.set(k, v);
    }

    let body;
    if (req.method !== "GET" && req.method !== "HEAD"){
      const chunks = [];
      for await (const c of req) chunks.push(c);
      body = Buffer.concat(chunks);
    }

    const request = new Request(url, {method: req.method, headers, body});
    const out = await worker.fetch(request, {ERGP: KV, ADMIN_KEY: ADMIN_KEY});

    const outHeaders = {};
    out.headers.forEach((v, k) => { outHeaders[k] = v; });
    res.writeHead(out.status, outHeaders);
    if (out.body){
      const buf = Buffer.from(await out.arrayBuffer());
      res.end(buf);
    } else {
      res.end();
    }
  } catch(e){
    res.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
    res.end("Ошибка сервера: " + (e && e.message ? e.message : "неизвестно"));
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log("ERGP server listening on 127.0.0.1:" + PORT + ", data in " + DATA_DIR);
});

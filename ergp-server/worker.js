/* =====================================================================
   ERGP Course Worker · v1 · 2026-08-07
   Отдельный сервис курса ERGP. НЕ связан с quiz-воркером risk-place-quiz.
   Привязка KV: namespace ERGP (binding name: ERGP).
   Ключ админа: замени REPLACE_ADMIN_KEY значением из worker key.txt
   (или задай переменную окружения ADMIN_KEY в настройках воркера).
   ===================================================================== */
const ADMIN_KEY_FALLBACK = ""; // на сервере ключ приходит из переменной окружения ADMIN_KEY, в файле его нет
const CONTACT_EMAIL = "info@risk-place.ru";

/* ---------- служебные ---------- */
function todayISO(){ return new Date().toISOString().slice(0, 10); }
function fmtRu(iso){ const p = (iso || "").split("-"); return p.length === 3 ? p[2] + "." + p[1] + "." + p[0] : iso; }
function addDays(iso, days){
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
function json(data, status){ return new Response(JSON.stringify(data), {status: status || 200, headers: {"Content-Type": "application/json; charset=utf-8"}}); }
function esc(s){ return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

function brandPage(title, text, lang){
  return new Response('<!DOCTYPE html><html lang="' + (lang || 'ru') + '"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>' + esc(title) + '</title><style>' +
    'body{margin:0;font-family:Tahoma,Verdana,sans-serif;background:#F7F4EF;color:#16181F;display:flex;align-items:center;justify-content:center;min-height:100vh}' +
    '.card{max-width:480px;background:#fff;border:1px solid #E1DCD3;border-radius:16px;padding:40px 44px;text-align:center}' +
    '.lg{font-size:20px;font-weight:700}.lg b{color:#C4571C}.tg{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#3D4149;margin-top:4px}' +
    'h1{font-size:21px;margin:26px 0 12px}p{font-size:15px;color:#3D4149;line-height:1.55;margin:0}' +
    '</style></head><body><div class="card"><div class="lg">risk-place<b>.org</b></div><div class="tg">Business Continuity &amp; Resilience · GCC</div>' +
    '<h1>' + esc(title) + '</h1><p>' + text + '</p></div></body></html>',
    {status: 200, headers: {"Content-Type": "text/html; charset=utf-8"}});
}

/* ---------- студентский контур ---------- */
async function serveCourse(url, kv){
  const t = url.searchParams.get("t");
  if (!t) return brandPage("Access by personal link",
    "The ERGP course opens via a personal link that each participant receives when access is activated. If you do not have a link or have lost it, please write to us: <b>" + CONTACT_EMAIL + "</b>", "en");
  const st = await kv.get("student:" + t, "json");
  if (!st || st.active === false) return brandPage("Доступ не найден",
    "Ссылка недействительна или доступ отключен. Напишите нам: <b>" + CONTACT_EMAIL + "</b>");
  if (todayISO() > st.until) return brandPage("Срок доступа завершился",
    "Доступ к курсу действовал до " + fmtRu(st.until) + ". Ваш прогресс сохранен — после продления все откроется на том же месте. Напишите нам: <b>" + CONTACT_EMAIL + "</b>");
  const rec = (await kv.get("prog:" + t, "json")) || {};
  rec.lastSeen = new Date().toISOString();
  await kv.put("prog:" + t, JSON.stringify(rec));
  const tplHtml = await kv.get("asset:course");
  if (!tplHtml) return brandPage("Курс готовится к запуску",
    "Материалы курса еще загружаются. Попробуйте зайти позже или напишите нам: <b>" + CONTACT_EMAIL + "</b>");
  const html = tplHtml
    .replace('"__STUDENT_JSON__"', JSON.stringify({name: st.name, email: st.email, sid: st.sid, until: fmtRu(st.until)}))
    .replace('"__TOKEN__"', JSON.stringify(t))
    .replace('"__SERVER_PROG__"', JSON.stringify(rec.prog || null));
  return new Response(html, {headers: {"Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store"}});
}


function mergeProg(oldP, newP){
  if (!oldP || typeof oldP !== "object") return newP || null;
  if (!newP || typeof newP !== "object") return oldP;
  const out = {done: [], pq: {}, last: {}};
  out.done = Array.from(new Set([...(oldP.done||[]), ...(newP.done||[])]));
  const keys = new Set([...Object.keys(oldP.pq||{}), ...Object.keys(newP.pq||{})]);
  keys.forEach(k => { out.pq[k] = Array.from(new Set([...((oldP.pq||{})[k]||[]), ...((newP.pq||{})[k]||[])])); });
  for (let m = 1; m <= 6; m++){
    const fl = "m" + m + "TestPassed", at = "m" + m + "Attempts";
    out[fl] = !!(oldP[fl] || newP[fl]);
    const a = oldP[at] || [], b = newP[at] || [];
    out[at] = b.length >= a.length ? b : a;
  }
  Object.keys(oldP.last||{}).forEach(k => { out.last[k] = (oldP.last||{})[k]; });
  Object.keys(newP.last||{}).forEach(k => { if ((newP.last||{})[k]) out.last[k] = newP.last[k]; });
  const oc = oldP.capstone, nc = newP.capstone;
  const cap = (oc && nc) ? (((nc.ts || "") >= (oc.ts || "")) ? nc : oc) : (nc || oc);
  if (cap) out.capstone = cap;
  return out;
}
async function apiProgress(req, url, kv){
  const t = url.searchParams.get("t");
  if (!t) return json({ok: false}, 400);
  const st = await kv.get("student:" + t, "json");
  if (!st || st.active === false || todayISO() > st.until) return json({ok: false}, 403);
  let body;
  try { body = await req.json(); } catch(e) { return json({ok: false}, 400); }
  if (!body || typeof body !== "object") return json({ok: false}, 400);
  const raw = JSON.stringify(body);
  if (raw.length > 300000) return json({ok: false, err: "too big"}, 413);
  const rec = (await kv.get("prog:" + t, "json")) || {};
  rec.prog = mergeProg(rec.prog, body.prog);
  const _nd = ((body.prog||{}).done||[]).length, _od = ((rec.prog||{}).done||[]).length;
  rec.summary = (body.summary && _nd >= _od * 0.5) ? body.summary : (rec.summary || body.summary || null);
  rec.lastSeen = new Date().toISOString();
  rec.updated = rec.lastSeen;
  await kv.put("prog:" + t, JSON.stringify(rec));
  return json({ok: true});
}

/* ---------- админский контур ---------- */
async function adminUpload(req, kv, adminKey, url){
  if (!authOk(url, adminKey)) return json({err: "auth"}, 403);
  const body = await req.text();
  if (!body || body.length < 100000) return json({err: "файл слишком маленький — это точно курс?"}, 400);
  if (body.length > 5000000) return json({err: "файл больше 5 МБ"}, 413);
  if (body.indexOf('"__STUDENT_JSON__"') < 0 || body.indexOf('"__TOKEN__"') < 0)
    return json({err: "в файле нет маркеров персонализации — нужен course-asset.html из релиза"}, 400);
  if (body.trimEnd().slice(-7) !== "</html>") return json({err: "файл оборван — нет закрывающего тега html"}, 400);
  await kv.put("asset:course", body);
  const meta = {size: body.length, uploaded: new Date().toISOString()};
  await kv.put("asset:meta", JSON.stringify(meta));
  return json({ok: true, size: meta.size, uploaded: meta.uploaded});
}
async function adminAsset(url, kv, adminKey){
  if (!authOk(url, adminKey)) return json({err: "auth"}, 403);
  const meta = await kv.get("asset:meta", "json");
  return json({ok: true, meta: meta || null});
}
function authOk(url, adminKey){
  const k = url.searchParams.get("key");
  return !!k && k === adminKey && adminKey !== "REPLACE_ADMIN_KEY";
}

async function adminList(url, kv, adminKey){
  if (!authOk(url, adminKey)) return json({err: "auth"}, 403);
  const out = [];
  let cursor;
  do {
    const page = await kv.list({prefix: "student:", cursor: cursor});
    for (const k of page.keys){
      const token = k.name.slice(8);
      const st = await kv.get(k.name, "json");
      if (!st) continue;
      const pr = (await kv.get("prog:" + token, "json")) || {};
      out.push({token: token, name: st.name, email: st.email, sid: st.sid, until: st.until,
        active: st.active !== false, created: st.created || "",
        lastSeen: pr.lastSeen || "", summary: pr.summary || null});
    }
    cursor = page.list_complete ? null : page.cursor;
  } while (cursor);
  out.sort((a, b) => (a.sid < b.sid ? -1 : 1));
  return json({ok: true, students: out});
}

async function adminAdd(req, kv, adminKey, url){
  if (!authOk(url, adminKey)) return json({err: "auth"}, 403);
  let b; try { b = await req.json(); } catch(e) { return json({err: "body"}, 400); }
  const name = (b.name || "").trim(), email = (b.email || "").trim();
  const days = parseInt(b.days, 10) || 180;
  if (!name || !email) return json({err: "имя и email обязательны"}, 400);
  const n = (parseInt(await kv.get("counter"), 10) || 0) + 1;
  await kv.put("counter", String(n));
  const sid = "S-2026-" + String(n).padStart(4, "0");
  const token = crypto.randomUUID().replace(/-/g, "");
  const st = {name: name, email: email, sid: sid, until: addDays(todayISO(), days), active: true, created: todayISO()};
  await kv.put("student:" + token, JSON.stringify(st));
  const base = url.pathname.indexOf("/course/") === 0 ? "/course" : "";
  return json({ok: true, token: token, sid: sid, until: st.until, link: url.origin + base + "/?t=" + token});
}

async function adminUpdate(req, kv, adminKey, url){
  if (!authOk(url, adminKey)) return json({err: "auth"}, 403);
  let b; try { b = await req.json(); } catch(e) { return json({err: "body"}, 400); }
  const st = await kv.get("student:" + b.token, "json");
  if (!st) return json({err: "не найден"}, 404);
  if (b.action === "extend"){
    const base = st.until > todayISO() ? st.until : todayISO();
    st.until = addDays(base, parseInt(b.days, 10) || 90);
  } else if (b.action === "off") st.active = false;
  else if (b.action === "on") st.active = true;
  else if (b.action === "edit"){
    const nm = (b.name || "").trim(), em = (b.email || "").trim();
    if (!nm || !em) return json({err: "имя и email не могут быть пустыми"}, 400);
    st.name = nm; st.email = em;
    if (b.until && /^\d{4}-\d{2}-\d{2}$/.test(b.until)) st.until = b.until;
    st.edited = new Date().toISOString();
  }
  else return json({err: "action"}, 400);
  await kv.put("student:" + b.token, JSON.stringify(st));
  return json({ok: true, until: st.until, active: st.active !== false, name: st.name, email: st.email});
}

async function adminMemo(url, kv, adminKey){
  if (!authOk(url, adminKey)) return brandPage("Нет доступа", "Неверный ключ.");
  const t = url.searchParams.get("t");
  const st = await kv.get("student:" + t, "json");
  const pr = (await kv.get("prog:" + t, "json")) || {};
  const f = (pr.prog && pr.prog.capstone && pr.prog.capstone.f) || {};
  const L = (lbl, id) => "<h3>" + esc(lbl) + "</h3><p>" + (esc(f[id]) || "<i>не заполнено</i>").replace(/\n/g, "<br>") + "</p>";
  let svc = "";
  for (let r = 0; r < 3; r++){
    svc += "<h2>Услуга " + (r + 1) + ": " + (esc(f["cap-sv" + r + "-name"]) || "<i>—</i>") + "</h2>" +
      "<p><b>Толерантность:</b> " + (esc(f["cap-sv" + r + "-tol"]) || "—") + " · <b>RTO/RPO:</b> " + (esc(f["cap-sv" + r + "-rec"]) || "—") + "</p>" +
      L("Обоснование", "cap-sv" + r + "-why") + L("Мини-план защиты", "cap-sv" + r + "-plan");
  }
  const html = '<!DOCTYPE html><html lang="ru"><head><meta charset="utf-8"><title>Меморандум · ' + esc(st ? st.name : t) + '</title><style>' +
    'body{font-family:Tahoma,Verdana,sans-serif;background:#F7F4EF;color:#16181F;max-width:820px;margin:0 auto;padding:40px 24px;line-height:1.55}' +
    'h1{font-size:24px}h2{font-size:18px;margin-top:28px;color:#A03F12}h3{font-size:15px;margin:16px 0 4px}p{margin:6px 0;font-size:14.5px;color:#3D4149}' +
    '.meta{color:#3D4149;font-size:13px;border-bottom:2px solid #E1DCD3;padding-bottom:14px}' +
    '</style></head><body><h1>Меморандум совету директоров об устойчивости</h1>' +
    '<p class="meta">' + esc(st ? st.name + " · " + st.email + " · " + st.sid : "") + ' · статус: ' + esc((pr.summary && pr.summary.cap) || "—") + ' · обновлен: ' + esc((pr.updated || "").slice(0, 16).replace("T", " ")) + '</p>' +
    L("1. Отрасль и масштаб", "cap-c1") + L("Ключевые продукты и клиенты", "cap-c2") + L("География", "cap-c3") + L("Критичные зависимости", "cap-c4") +
    "<h2>2. Заявление об аппетите</h2><p>" + (esc(f["cap-app"]) || "<i>не заполнено</i>").replace(/\n/g, "<br>") + "</p>" +
    "<h2>3. Критичные услуги</h2>" + svc +
    "<h2>4. Сценарий в деньгах</h2>" + L("Сценарий", "cap-sc-dev") + L("Прямые потери по дням", "cap-sc-dir") + L("Необратимые потери после границы", "cap-sc-irr") + L("Итоговая оценка", "cap-sc-total") +
    "<h2>5. Готовность к кризису</h2>" + L("Штаб", "cap-cr-hq") + L("Критерии активации", "cap-cr-act") + L("Полномочия первых часов", "cap-cr-pow") + L("Первое сообщение", "cap-cr-msg") +
    "<h2>6. Предложение совету</h2>" + L("Утверждение аппетита и толерантностей", "cap-p1") + L("Меры и бюджет", "cap-p2") + L("Запрашиваемое решение", "cap-p3") +
    "</body></html>";
  return new Response(html, {headers: {"Content-Type": "text/html; charset=utf-8"}});
}

function adminPage(url, adminKey){
  if (!authOk(url, adminKey)) return brandPage("Нет доступа", "Админ-страница доступна по секретному ключу: /admin?key=...");
  const html = `<!DOCTYPE html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>ERGP · Админ</title><style>
body{font-family:Tahoma,Verdana,sans-serif;background:#F7F4EF;color:#16181F;margin:0;padding:30px 20px}
.wrap{max-width:1180px;margin:0 auto}
h1{font-size:22px}h1 b{color:#C4571C}
.add{background:#fff;border:1px solid #E1DCD3;border-radius:12px;padding:16px 18px;margin:18px 0;display:flex;gap:10px;flex-wrap:wrap;align-items:center}
.add input{border:1px solid #E1DCD3;border-radius:8px;padding:9px 11px;font-size:14px;font-family:inherit}
.add button,.rowbtn{border:none;border-radius:8px;padding:9px 14px;font-size:13px;font-family:inherit;font-weight:700;cursor:pointer;background:#16181F;color:#fff}
.rowbtn{background:#F1EEE8;color:#16181F;font-weight:400;margin-right:4px;padding:6px 10px}
.rowbtn.warn{background:#FBE0CB;color:#A03F12}
table{width:100%;border-collapse:collapse;background:#fff;border:1px solid #E1DCD3;border-radius:12px;overflow:hidden}
th{background:#F1EEE8;font-size:11.5px;text-transform:uppercase;letter-spacing:.05em;color:#3D4149;text-align:left;padding:10px 10px}
td{padding:10px 10px;border-top:1px solid #F1EEE8;font-size:13.5px;vertical-align:top}
.sid{font-size:11.5px;color:#3D4149}
.pb{display:inline-block;width:26px;text-align:center;border-radius:5px;padding:2px 0;font-size:11.5px;margin-right:2px;background:#F1EEE8;color:#3D4149}
.pb.full{background:#7BD6A0;color:#16181F}.pb.part{background:#F0A868;color:#16181F}
.cap-l{font-size:12px;border-radius:10px;padding:2px 9px;background:#F1EEE8;color:#3D4149}
.cap-l.ok{background:#7BD6A0;color:#16181F}.cap-l.wk{background:#F0A868;color:#16181F}
.off{opacity:.45}
#msg{margin:10px 0;font-size:13.5px;color:#A03F12;word-break:break-all}
</style></head><body><div class="wrap">
<h1>ERGP · студенты <b>·</b> админ</h1>
<div class="add">
  <input id="a-name" placeholder="Имя Фамилия" style="width:220px">
  <input id="a-email" placeholder="email" style="width:220px">
  <input id="a-days" placeholder="дней (180)" style="width:90px">
  <button onclick="addStudent()">Создать доступ</button>
</div>
<div class="add" style="gap:14px">
  <b style="font-size:13px">Файл курса:</b> <span id="asset-info" style="font-size:13px;color:#3D4149">проверяю...</span>
  <input type="file" id="up" accept=".html">
  <button onclick="uploadCourse()">Загрузить курс</button>
</div>
<div id="msg"></div>
<table><thead><tr><th>Студент</th><th>Модули 1-6</th><th>Тесты (попытки)</th><th>Итоговая</th><th>Где</th><th>Последний вход</th><th>Доступ до</th><th>Действия</th></tr></thead>
<tbody id="tb"><tr><td colspan="8">Загрузка...</td></tr></tbody></table>
</div>
<script>
const KEY = new URLSearchParams(location.search).get("key");
const BASE = location.pathname.indexOf("/course/") === 0 ? "/course" : "";
function esc(s){ return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function fmtRu(iso){ const p=(iso||"").split("-"); return p.length===3 ? p[2]+"."+p[1]+"."+p[0] : (iso||"—"); }
function fmtTs(ts){ return ts ? ts.slice(0,16).replace("T"," ") : "—"; }
async function load(){
  const r = await fetch(BASE + "/api/admin/list?key="+encodeURIComponent(KEY));
  const d = await r.json();
  if (!d.ok){ document.getElementById("tb").innerHTML = "<tr><td colspan=8>Ошибка доступа</td></tr>"; return; }
  const tb = document.getElementById("tb"); tb.innerHTML = "";
  if (!d.students.length){ tb.innerHTML = "<tr><td colspan=8>Студентов пока нет — создай первый доступ выше</td></tr>"; return; }
  d.students.forEach(s => {
    const sm = s.summary || {};
    let bars = "";
    for (let m=1;m<=6;m++){
      const p = (sm.pcts||{})[m]||0;
      bars += '<span class="pb '+(p===100?"full":(p>0?"part":""))+'" title="Модуль '+m+'">'+p+'</span>';
    }
    let tests = "";
    for (let m=1;m<=6;m++){
      const ok = (sm.ft||{})[m], at = (sm.att||{})[m]||0;
      tests += (ok?"✓":"·")+(at?("<small>"+at+"</small>"):"")+" ";
    }
    const cap = sm.cap||"НЕ НАЧАТА";
    const capCls = cap==="СОХРАНЕНА"?"ok":(cap==="В РАБОТЕ"?"wk":"");
    const tr = document.createElement("tr");
    if (!s.active) tr.className = "off";
    tr.innerHTML = "<td>"+esc(s.name)+"<br><span class='sid'>"+esc(s.email)+" · "+esc(s.sid)+(s.active?"":" · ВЫКЛ")+"</span></td>"+
      "<td>"+bars+"</td><td style='font-family:monospace'>"+tests+"</td>"+
      "<td><span class='cap-l "+capCls+"'>"+esc(cap)+"</span><br><a href='" + BASE + "/api/admin/memo?key="+encodeURIComponent(KEY)+"&t="+s.token+"' target='_blank' style='font-size:12px'>читать</a></td>"+
      "<td>"+esc(sm.loc||"—")+"</td><td>"+fmtTs(s.lastSeen)+"</td><td>"+fmtRu(s.until)+"</td>"+
      "<td><button class='rowbtn' onclick='copyLink(\\""+s.token+"\\")'>ссылка</button>"+
      "<button class='rowbtn' onclick='editStudent(\\""+s.token+"\\")'>правка</button>"+
      "<button class='rowbtn' onclick='upd(\\""+s.token+"\\",\\"extend\\")'>+90 дн</button>"+
      "<button class='rowbtn warn' onclick='upd(\\""+s.token+"\\",\\""+(s.active?"off":"on")+"\\")'>"+(s.active?"выкл":"вкл")+"</button></td>";
    tb.appendChild(tr);
  });
}
function copyLink(t){
  const link = location.origin + BASE + "/?t=" + t;
  navigator.clipboard.writeText(link).then(()=>{ msg("Ссылка скопирована: " + link); }, ()=>{ msg("Ссылка: " + link); });
}
function msg(s){ document.getElementById("msg").textContent = s; }
async function addStudent(){
  const name = document.getElementById("a-name").value.trim();
  const email = document.getElementById("a-email").value.trim();
  const days = document.getElementById("a-days").value.trim();
  if (!name || !email){ msg("Заполни имя и email"); return; }
  const r = await fetch(BASE + "/api/admin/add?key="+encodeURIComponent(KEY), {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({name:name, email:email, days:days})});
  const d = await r.json();
  if (d.ok){ msg("Создан " + d.sid + " до " + fmtRu(d.until) + ". Ссылка: " + d.link); document.getElementById("a-name").value=""; document.getElementById("a-email").value=""; load(); }
  else msg("Ошибка: " + (d.err||r.status));
}
async function editStudent(t){
  const r0 = await fetch(BASE + "/api/admin/list?key="+encodeURIComponent(KEY));
  const d0 = await r0.json();
  const s = (d0.students||[]).find(x => x.token === t);
  if (!s){ msg("Студент не найден"); return; }
  const name = prompt("Имя и фамилия участника:", s.name);
  if (name === null) return;
  const email = prompt("Email:", s.email);
  if (email === null) return;
  const until = prompt("Доступ до (ГГГГ-ММ-ДД), пусто — не менять:", s.until || "");
  if (until === null) return;
  const body = {token: t, action: "edit", name: name, email: email};
  if (until && until.trim()) body.until = until.trim();
  const r = await fetch(BASE + "/api/admin/update?key="+encodeURIComponent(KEY), {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(body)});
  const d = await r.json();
  if (d.ok){ msg("Данные обновлены: " + d.name + " · " + d.email + " · доступ до " + fmtRu(d.until)); load(); }
  else msg("Ошибка: " + (d.err||r.status));
}
async function upd(t, action){
  const r = await fetch(BASE + "/api/admin/update?key="+encodeURIComponent(KEY), {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({token:t, action:action, days:90})});
  const d = await r.json();
  if (d.ok) load(); else msg("Ошибка: " + (d.err||r.status));
}
async function loadAsset(){
  const r = await fetch(BASE + "/api/admin/asset?key="+encodeURIComponent(KEY));
  const d = await r.json();
  document.getElementById("asset-info").textContent = d.meta
    ? Math.round(d.meta.size/1024) + " КБ, загружен " + fmtTs(d.meta.uploaded)
    : "НЕ ЗАГРУЖЕН — курс не будет открываться у студентов";
}
async function uploadCourse(){
  const f = document.getElementById("up").files[0];
  if (!f){ msg("Выбери файл course-asset.html"); return; }
  msg("Загружаю " + Math.round(f.size/1024) + " КБ...");
  const text = await f.text();
  const r = await fetch(BASE + "/api/admin/upload?key="+encodeURIComponent(KEY), {method:"POST", body: text});
  const d = await r.json();
  if (d.ok){ msg("Курс загружен: " + Math.round(d.size/1024) + " КБ"); loadAsset(); }
  else msg("Ошибка загрузки: " + (d.err||r.status));
}
load(); loadAsset();
</script></body></html>`;
  return new Response(html, {headers: {"Content-Type": "text/html; charset=utf-8"}});
}

function page404(){ return brandPage("Page not found", "Please check the address or open the course using your personal link.", "en"); }

module.exports = {
  async fetch(req, env){
    const url = new URL(req.url);
    const kv = env.ERGP;
    const adminKey = env.ADMIN_KEY || ADMIN_KEY_FALLBACK;
    try {
      if (!kv) return brandPage("Настройка не завершена", "Не привязано KV-хранилище ERGP (Settings → Bindings).");
      const p = url.pathname.replace(/^\/course(?=\/|$)/, "") || "/";
      if (p === "/api/progress" && req.method === "POST") return await apiProgress(req, url, kv);
      if (p === "/admin") return adminPage(url, adminKey);
      if (p === "/api/admin/list") return await adminList(url, kv, adminKey);
      if (p === "/api/admin/add" && req.method === "POST") return await adminAdd(req, kv, adminKey, url);
      if (p === "/api/admin/update" && req.method === "POST") return await adminUpdate(req, kv, adminKey, url);
      if (p === "/api/admin/memo") return await adminMemo(url, kv, adminKey);
      if (p === "/api/admin/upload" && req.method === "POST") return await adminUpload(req, kv, adminKey, url);
      if (p === "/api/admin/asset") return await adminAsset(url, kv, adminKey);
      if (p === "/") return await serveCourse(url, kv);
      return page404();
    } catch(e){
      return new Response("Ошибка сервера: " + e.message, {status: 500, headers: {"Content-Type": "text/plain; charset=utf-8"}});
    }
  }
};



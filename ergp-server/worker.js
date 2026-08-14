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

/* ---------- языки курса ----------
   Поддерживаются ru, en, ar. Ключ файла курса в хранилище:
     asset:course       — русская версия (историческое имя, не меняем)
     asset:course:en    — английская
     asset:course:ar    — арабская
   Выбор языка при выдаче курса, по убыванию приоритета:
     1) параметр адреса ?lang=
     2) поле lang в карточке участника
     3) ru для участников, заведенных до появления языков
     4) en для всех новых
   Если выбранный язык еще не загружен, отдается доступный с пометкой.        */
const LANGS = ["en", "ar", "ru"];
function normLang(v){ return LANGS.indexOf(String(v || "").toLowerCase()) > -1 ? String(v).toLowerCase() : null; }
function assetKey(lang){ return lang === "ru" ? "asset:course" : "asset:course:" + lang; }
function metaKey(lang){ return lang === "ru" ? "asset:meta" : "asset:meta:" + lang; }

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

  // Разрешенные языки участника: st.langs = ["ar"] и т.п.
  // Пустое поле или его отсутствие = разрешены все языки.
  const allowed = (Array.isArray(st.langs) && st.langs.length)
    ? st.langs.filter(function(x){ return LANGS.indexOf(x) > -1; })
    : LANGS.slice();

  // выбор языка: адрес -> карточка участника -> ru для старых, en для новых
  let asked = normLang(url.searchParams.get("lang"));
  if (asked && allowed.indexOf(asked) < 0) asked = null;
  let prev = normLang(st.lang);
  if (prev && allowed.indexOf(prev) < 0) prev = null;
  let lang = asked || prev || (st.created && st.created < "2026-08-11" ? "ru" : "en");
  if (allowed.indexOf(lang) < 0) lang = allowed[0];

  let tplHtml = await kv.get(assetKey(lang));
  let fallback = null;
  if (!tplHtml){
    // Запрошенного языка еще нет. Откатываемся по порядку: прежний выбор
    // участника, затем английский, затем русский, затем арабский.
    for (const alt of [prev, "en", "ru", "ar"]){
      if (!alt || alt === lang) continue;
      if (allowed.indexOf(alt) < 0) continue;
      const cand = await kv.get(assetKey(alt));
      if (cand){ tplHtml = cand; fallback = lang; lang = alt; break; }
    }
  } else if (asked && asked !== prev){
    // Осознанный выбор запоминаем только если этот язык действительно есть.
    st.lang = asked;
    await kv.put("student:" + t, JSON.stringify(st));
  }
  if (!tplHtml) return brandPage("Курс готовится к запуску",
    "Материалы курса еще загружаются. Попробуйте зайти позже или напишите нам: <b>" + CONTACT_EMAIL + "</b>");

  await kv.put("prog:" + t, JSON.stringify(rec));

  const langsReady = [];
  for (const L of LANGS){
    if (allowed.indexOf(L) < 0) continue;
    if (await kv.get(metaKey(L))) langsReady.push(L);
  }
  if (langsReady.indexOf(lang) < 0) langsReady.push(lang);

  const html = tplHtml
    .replace('"__STUDENT_JSON__"', JSON.stringify({name: st.name, email: st.email, sid: st.sid, until: fmtRu(st.until)}))
    .replace('"__TOKEN__"', JSON.stringify(t))
    .replace('"__SERVER_PROG__"', JSON.stringify(rec.prog || null))
    .replace('"__LANG__"', JSON.stringify(lang))
    .replace('"__LANGS_READY__"', JSON.stringify(langsReady))
    .replace('"__LANG_FALLBACK__"', JSON.stringify(fallback));
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
  const lang = normLang(url.searchParams.get("lang")) || "ru";
  await kv.put(assetKey(lang), body);
  const meta = {size: body.length, uploaded: new Date().toISOString(), lang: lang};
  await kv.put(metaKey(lang), JSON.stringify(meta));
  return json({ok: true, lang: lang, size: meta.size, uploaded: meta.uploaded});
}
async function adminAsset(url, kv, adminKey){
  if (!authOk(url, adminKey)) return json({err: "auth"}, 403);
  const meta = await kv.get("asset:meta", "json");
  const byLang = {};
  for (const L of LANGS){ byLang[L] = (await kv.get(metaKey(L), "json")) || null; }
  return json({ok: true, meta: meta || null, langs: byLang});
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
        langs: (Array.isArray(st.langs) && st.langs.length) ? st.langs : null,
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
  // Ограничение языков: массив вида ["ar"]. Пусто или все три = без ограничений.
  const reqLangs = Array.isArray(b.langs)
    ? b.langs.filter(function(x){ return LANGS.indexOf(x) > -1; }) : [];
  let lang = normLang(b.lang) || "en";   // по умолчанию английский, решение Евгения 10.08.2026
  if (reqLangs.length && reqLangs.indexOf(lang) < 0) lang = reqLangs[0];
  const st = {name: name, email: email, sid: sid, until: addDays(todayISO(), days), active: true, created: todayISO(), lang: lang};
  if (reqLangs.length && reqLangs.length < LANGS.length) st.langs = reqLangs;
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
  else if (b.action === "until"){
    const v = String(b.until || "").trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return json({err: "дата в формате ГГГГ-ММ-ДД"}, 400);
    const d = new Date(v + "T00:00:00Z");
    if (isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== v)
      return json({err: "такой даты не существует"}, 400);
    st.until = v;
    st.edited = new Date().toISOString();
  }
  else if (b.action === "langs"){
    const langs = Array.isArray(b.langs)
      ? b.langs.filter(function(x){ return LANGS.indexOf(x) > -1; }) : [];
    if (!langs.length || langs.length >= LANGS.length) delete st.langs;
    else {
      st.langs = langs;
      if (st.lang && langs.indexOf(st.lang) < 0) st.lang = langs[0];
    }
  }
  else return json({err: "action"}, 400);
  await kv.put("student:" + b.token, JSON.stringify(st));
  return json({ok: true, until: st.until, active: st.active !== false, name: st.name, email: st.email, langs: st.langs || null});
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


/* ---------- заявки с сайта: демонстрация и тестировщики ----------
   Форма на risk-place.org шлет сюда JSON. Мы сохраняем заявку в хранилище,
   показываем ее в админке и, если заданы BOT_TOKEN и CHAT_ID, дублируем в
   Telegram. Почту сервер не шлет — приглашение отправляет Евгений сам.     */

const LEAD_ORIGINS = ["https://risk-place.org", "https://www.risk-place.org",
                      "https://bcm.risk-place.ru"];

function corsHeaders(req){
  const o = req.headers.get("Origin") || "";
  const allow = LEAD_ORIGINS.indexOf(o) > -1 ? o : LEAD_ORIGINS[0];
  return {"Access-Control-Allow-Origin": allow,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"};
}

async function apiLead(req, kv, env){
  const cors = corsHeaders(req);
  let b; try { b = await req.json(); } catch(e){
    return new Response('{"err":"body"}', {status: 400,
      headers: Object.assign({"Content-Type": "application/json"}, cors)});
  }
  const type = b.type === "tester" ? "tester" : "demo";
  const PRODUCTS = ["ergp", "dashboard", "consulting", "assessment"];
  const product = PRODUCTS.indexOf(b.product) >= 0 ? b.product : "";
  const name = String(b.name || "").trim().slice(0, 200);
  const email = String(b.email || "").trim().slice(0, 200);
  if (!name || !email || email.indexOf("@") < 0)
    return new Response('{"err":"name and email required"}', {status: 400,
      headers: Object.assign({"Content-Type": "application/json"}, cors)});
  const source = b.source === "ru" ? "ru" : "";
  const lead = {
    type: type, product: product, source: source, name: name, email: email,
    org: String(b.org || "").trim().slice(0, 300),
    role: String(b.role || "").trim().slice(0, 300),
    message: String(b.message || "").trim().slice(0, 4000),
    lang: ["ar", "ru"].indexOf(b.lang) > -1 ? b.lang : "en",
    page: String(b.page || "").slice(0, 50),
    ts: new Date().toISOString()
  };
  await kv.put("lead:" + Date.now() + "-" + Math.random().toString(36).slice(2, 8),
               JSON.stringify(lead));
  // Telegram — попытка, не обязательство: заявка уже сохранена.
  try {
    if (env && env.BOT_TOKEN && env.CHAT_ID){
      const PLABEL = {ergp: "СЕРТИФИКАЦИЯ ERGP", dashboard: "ДАШБОРД",
                      consulting: "КОНСАЛТИНГ", assessment: "САМООЦЕНКА"};
      const head = (type === "tester" ? "ЗАЯВКА ТЕСТИРОВЩИКА (AR)"
        : "ЗАПРОС ДЕМО · " + (PLABEL[product] || "БЕЗ ПРОДУКТА")) +
        (source === "ru" ? " · РОССИЙСКИЙ САЙТ" : "");
      const text = head + "\n" + lead.name + " · " + lead.email +
        (lead.org ? "\n" + lead.org : "") + (lead.role ? " · " + lead.role : "") +
        (lead.message ? "\n---\n" + lead.message.slice(0, 1500) : "");
      await fetch("https://api.telegram.org/bot" + env.BOT_TOKEN + "/sendMessage", {
        method: "POST", headers: {"Content-Type": "application/json"},
        body: JSON.stringify({chat_id: env.CHAT_ID, text: text})
      });
    }
  } catch(e){}
  return new Response('{"ok":true}',
    {headers: Object.assign({"Content-Type": "application/json"}, cors)});
}

async function adminLeads(url, kv, adminKey){
  if (!authOk(url, adminKey)) return json({err: "auth"}, 403);
  const list = await kv.list({prefix: "lead:"});
  const out = [];
  for (const k of list.keys.slice(-200)){
    const v = await kv.get(k.name, "json");
    if (v) out.push(v);
  }
  out.sort(function(a, b){ return a.ts < b.ts ? 1 : -1; });
  return json({ok: true, leads: out});
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
  <span style="font-size:13px;display:flex;gap:8px;align-items:center"><b>Языки:</b>
    <label><input type="checkbox" id="a-l-en" checked> EN</label>
    <label><input type="checkbox" id="a-l-ar" checked> AR</label>
    <label><input type="checkbox" id="a-l-ru" checked> RU</label>
  </span>
  <button onclick="addStudent()">Создать доступ</button>
</div>
<div class="add" style="gap:14px">
  <b style="font-size:13px">Файл курса:</b> <span id="asset-info" style="font-size:13px;color:#3D4149">проверяю...</span>
  <input type="file" id="up" accept=".html">
  <select id="uplang" style="font-family:inherit;font-size:13px;padding:4px 6px"><option value="ru">русский</option><option value="en">English</option><option value="ar">العربية</option></select>
  <button onclick="uploadCourse()">Загрузить курс</button>
</div>
<div id="msg"></div>
<h3 style="margin:18px 0 6px">Заявки с сайта <button onclick="loadLeads()" style="font-size:12px">обновить</button></h3>
<div id="leads" style="font-size:13px;color:#3D4149">загружаю...</div>
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
    const lmark = (s.langs && s.langs.length)
      ? "<br><span class='sid' style='color:#A03F12'>только " + s.langs.map(function(x){return x.toUpperCase();}).join("+") + "</span>" : "";
    tr.innerHTML = "<td>"+esc(s.name)+"<br><span class='sid'>"+esc(s.email)+" · "+esc(s.sid)+(s.active?"":" · ВЫКЛ")+"</span>"+lmark+"</td>"+
      "<td>"+bars+"</td><td style='font-family:monospace'>"+tests+"</td>"+
      "<td><span class='cap-l "+capCls+"'>"+esc(cap)+"</span><br><a href='" + BASE + "/api/admin/memo?key="+encodeURIComponent(KEY)+"&t="+s.token+"' target='_blank' style='font-size:12px'>читать</a></td>"+
      "<td>"+esc(sm.loc||"—")+"</td><td>"+fmtTs(s.lastSeen)+"</td><td>"+fmtRu(s.until)+"</td>"+
      "<td><button class='rowbtn' onclick='copyLink(\\""+s.token+"\\")'>ссылка</button>"+
      "<button class='rowbtn' onclick='editStudent(\\""+s.token+"\\")'>правка</button>"+
      "<button class='rowbtn' onclick='langsStudent(\\""+s.token+"\\",\\""+(s.langs||[]).join(",")+"\\")'>языки</button>"+
      "<button class='rowbtn' onclick='untilStudent(\\""+s.token+"\\",\\""+(s.until||"")+"\\")'>срок</button>"+
      "<button class='rowbtn' onclick='upd(\\""+s.token+"\\",\\"extend\\")'>+90 дн</button>"+
      "<button class='rowbtn warn' onclick='upd(\\""+s.token+"\\",\\""+(s.active?"off":"on")+"\\")'>"+(s.active?"выкл":"вкл")+"</button></td>";
    tb.appendChild(tr);
  });
}
async function untilStudent(t, cur){
  const hint = "Доступ до какого числа?\\n\\nМожно ввести:\\n  31.12.2026  или  2026-12-31 — точная дата\\n  +30 — добавить 30 дней к текущему сроку\\n  -7 — сократить на 7 дней";
  const v = prompt(hint, fmtRu(cur));
  if (v === null) return;
  const s = v.trim();
  let iso = null;
  if (/^[+-]\\d+$/.test(s)){
    const base = new Date(((cur && cur >= new Date().toISOString().slice(0,10)) ? cur : new Date().toISOString().slice(0,10)) + "T00:00:00Z");
    base.setUTCDate(base.getUTCDate() + parseInt(s, 10));
    iso = base.toISOString().slice(0, 10);
  } else if (/^\\d{2}\\.\\d{2}\\.\\d{4}$/.test(s)){
    const p = s.split(".");
    iso = p[2] + "-" + p[1] + "-" + p[0];
  } else if (/^\\d{4}-\\d{2}-\\d{2}$/.test(s)){
    iso = s;
  } else { msg("Не понял дату. Примеры: 31.12.2026, 2026-12-31, +30"); return; }
  const r = await fetch(BASE + "/api/admin/update?key="+encodeURIComponent(KEY), {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({token:t, action:"until", until:iso})});
  const d = await r.json();
  if (d.ok){
    const past = iso < new Date().toISOString().slice(0,10);
    msg("Срок доступа: " + fmtRu(d.until) + (past ? " — это прошедшая дата, доступ закрыт" : ""));
    load();
  }
  else msg("Ошибка: " + (d.err||r.status));
}
async function langsStudent(t, cur){
  const v = prompt("Разрешенные языки через запятую (en, ar, ru).\\nПусто или все три = без ограничений.", cur || "en,ar,ru");
  if (v === null) return;
  const langs = v.split(",").map(function(x){ return x.trim().toLowerCase(); }).filter(function(x){ return ["en","ar","ru"].indexOf(x) > -1; });
  const r = await fetch(BASE + "/api/admin/update?key="+encodeURIComponent(KEY), {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({token:t, action:"langs", langs:langs})});
  const d = await r.json();
  if (d.ok){ msg(d.langs ? ("Языки ограничены: " + d.langs.join(", ").toUpperCase()) : "Ограничение языков снято — доступны все"); load(); }
  else msg("Ошибка: " + (d.err||r.status));
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
  const langs = ["en","ar","ru"].filter(function(L){ return document.getElementById("a-l-"+L).checked; });
  if (!langs.length){ msg("Отметь хотя бы один язык"); return; }
  const r = await fetch(BASE + "/api/admin/add?key="+encodeURIComponent(KEY), {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({name:name, email:email, days:days, langs:langs})});
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
async function loadLeads(){
  const r = await fetch(BASE + "/api/admin/leads?key="+encodeURIComponent(KEY));
  const d = await r.json();
  const box = document.getElementById("leads");
  if (!d.ok){ box.textContent = "не удалось загрузить"; return; }
  if (!d.leads.length){ box.textContent = "заявок пока нет"; return; }
  var PL = {ergp: "ERGP", dashboard: "дашборд", consulting: "консалтинг", assessment: "самооценка"};
  box.innerHTML = "<table><thead><tr><th>Когда</th><th>Тип</th><th>Продукт</th><th>Кто</th><th>Организация</th><th>Сообщение</th></tr></thead><tbody>" +
    d.leads.map(function(l){
      return "<tr><td>" + esc((l.ts||"").replace("T"," ").slice(0,16)) + "</td><td>" +
        (l.type === "tester" ? "<b>тестировщик AR</b>" : "демо") + " · " + esc(l.lang||"") +
        (l.source === "ru" ? " · <b>RU-сайт</b>" : "") + "</td><td>" +
        esc(PL[l.product] || "—") + "</td><td>" +
        esc(l.name) + "<br>" + esc(l.email) + "</td><td>" + esc(l.org||"") +
        (l.role ? "<br>" + esc(l.role) : "") + "</td><td style='max-width:420px;white-space:pre-wrap'>" +
        esc(l.message||"") + "</td></tr>";
    }).join("") + "</tbody></table>";
}
loadLeads();
async function loadAsset(){
  const r = await fetch(BASE + "/api/admin/asset?key="+encodeURIComponent(KEY));
  const d = await r.json();
  document.getElementById("asset-info").textContent = d.meta
    ? Math.round(d.meta.size/1024) + " КБ, загружен " + fmtTs(d.meta.uploaded)
    : "НЕ ЗАГРУЖЕН — курс не будет открываться у студентов";
  const names = {ru: "русский", en: "English", ar: "العربية"};
  const parts = ["ru","en","ar"].map(function(L){
    const m = (d.langs||{})[L];
    return names[L] + ": " + (m ? Math.round(m.size/1024) + " КБ, " + fmtTs(m.uploaded) : "нет");
  });
  document.getElementById("asset-info").innerHTML += "<br>" + parts.join(" · ");
}
async function uploadCourse(){
  const f = document.getElementById("up").files[0];
  const lang = document.getElementById("uplang").value;
  if (!f){ msg("Выбери файл курса"); return; }
  msg("Загружаю " + Math.round(f.size/1024) + " КБ, язык " + lang + "...");
  const text = await f.text();
  const r = await fetch(BASE + "/api/admin/upload?key="+encodeURIComponent(KEY)+"&lang="+lang, {method:"POST", body: text});
  const d = await r.json();
  if (d.ok){ msg("Загружен " + d.lang + ": " + Math.round(d.size/1024) + " КБ"); loadAsset(); }
  else msg("Ошибка загрузки: " + (d.err||r.status));
}
load(); loadAsset();
</script></body></html>`;
  return new Response(html, {headers: {"Content-Type": "text/html; charset=utf-8"}});
}

/* ---------- пульс: /health ----------
   Зачем. Служба умеет быть формально живой и при этом отдавать участнику
   пустоту: файл курса не загрузился, хранилище перестало писать, заглушки
   не заменились. Проверка «отвечает ли порт» такого не видит. Поэтому здесь
   служба сама себя осматривает и отвечает кодом 503, если что-то не так.
   Наружу без ключа уходит только слово «в порядке или нет». Подробные числа
   отдаются по отдельному ключу HEALTH_KEY, а не по ключу администратора:
   наблюдателю нужны показания приборов, а не право менять данные.
   Персональных данных в ответе нет ни при каком ключе.                      */

const HEALTH_MIN_CHARS = 500000;   // страница короче — значит файл побился
const HEALTH_DRY_TTL   = 3600000;  // пробную сборку повторяем не чаще раза в час
let dryCache = null;

async function dryRender(kv, lang){
  /* Пробная сборка страницы для вымышленного участника. Ловит именно то,
     чего не видит обычная проверка доступности: файл на месте, но собрать
     из него страницу нельзя. Ничего не сохраняет.                          */
  const tpl = await kv.get(assetKey(lang));
  if (!tpl) return {ok: false, why: "файла курса нет в хранилище"};
  const marks = ['"__STUDENT_JSON__"', '"__TOKEN__"', '"__SERVER_PROG__"',
                 '"__LANG__"', '"__LANGS_READY__"', '"__LANG_FALLBACK__"'];
  const html = tpl
    .replace('"__STUDENT_JSON__"', JSON.stringify({name: "Проверка связи", email: "health@local", sid: "S-0000-0000", until: "01.01.2030"}))
    .replace('"__TOKEN__"', '"health-probe"')
    .replace('"__SERVER_PROG__"', "null")
    .replace('"__LANG__"', JSON.stringify(lang))
    .replace('"__LANGS_READY__"', "[]")
    .replace('"__LANG_FALLBACK__"', "null");
  const left = marks.filter(m => html.indexOf(m) > -1);
  if (left.length) return {ok: false, why: "заглушки не заменились: " + left.join(", ")};
  if (html.length < HEALTH_MIN_CHARS) return {ok: false, why: "страница подозрительно короткая, знаков " + html.length};
  return {ok: true, chars: html.length};
}

async function health(url, kv, env){
  const hk = env && env.HEALTH_KEY;
  const detail = !!(hk && url.searchParams.get("key") === hk);
  const problems = [], warnings = [];

  // 1. файлы курса по языкам.
  //    Проверяем не только запись о загрузке, но и сам файл. Иначе описание
  //    остается, файл исчезает, а пульс до часа отвечает «в порядке» — эту
  //    дыру нашла проверка tests/test-health.sh 10.08.2026.
  const langsKb = {};
  let stamp = "";
  for (const L of LANGS){
    const meta = await kv.get(metaKey(L), "json");
    langsKb[L] = meta ? Math.round(meta.size / 1024) : null;
    stamp += L + (meta ? meta.uploaded : "-");
    if (!meta) continue;
    let real = null;
    if (typeof globalThis.__ergpAssetSize === "function"){
      // на своем сервере размер берется без чтения файла целиком
      try { real = await globalThis.__ergpAssetSize(assetKey(L)); } catch(e){}
    } else {
      const tpl = await kv.get(assetKey(L));
      real = tpl === null ? null : tpl.length;
    }
    if (real === null) problems.push("описание языка " + L + " есть, а файла курса нет");
    else if (real < HEALTH_MIN_CHARS) problems.push("файл курса " + L + " подозрительно мал, знаков " + real);
    stamp += ":" + real;
  }
  if (langsKb.ru === null && langsKb.en === null && langsKb.ar === null)
    problems.push("в хранилище нет ни одного файла курса");

  // 2. пробная сборка страницы, не чаще раза в час и заново после новой загрузки
  let dry;
  if (dryCache && dryCache.stamp === stamp && Date.now() - dryCache.at < HEALTH_DRY_TTL){
    dry = dryCache.res;
  } else {
    const lang = langsKb.ru !== null ? "ru" : (langsKb.en !== null ? "en" : "ar");
    dry = await dryRender(kv, lang);
    dry.lang = lang;
    dryCache = {stamp: stamp, at: Date.now(), res: dry};
  }
  if (!dry.ok) problems.push("страница курса не собирается: " + dry.why);

  // 3. хранилище пишет и отдает записанное
  try {
    const probe = "health:probe", now = String(Date.now());
    await kv.put(probe, now);
    if ((await kv.get(probe)) !== now) problems.push("хранилище не отдает только что записанное");
  } catch(e){
    problems.push("хранилище недоступно для записи: " + (e && e.message ? e.message : "ошибка"));
  }

  // 4. показатели машины. На Cloudflare их нет, и это не ошибка.
  let host = null;
  if (typeof globalThis.__ergpHostFacts === "function"){
    try { host = await globalThis.__ergpHostFacts(); }
    catch(e){ warnings.push("не удалось снять показатели машины"); }
  }
  if (host){
    if (host.diskFreeMb !== null && host.diskFreeMb !== undefined){
      if (host.diskFreeMb < 500) problems.push("на диске осталось " + host.diskFreeMb + " МБ");
      else if (host.diskFreeMb < 2048) warnings.push("на диске осталось " + host.diskFreeMb + " МБ");
    }
    if (host.backupAgeH !== null && host.backupAgeH !== undefined && host.backupAgeH > 26)
      warnings.push("последней ночной копии " + host.backupAgeH + " часов");
    if (host.certDays !== null && host.certDays !== undefined){
      if (host.certDays < 5) problems.push("сертификат истекает через " + host.certDays + " дн.");
      else if (host.certDays < 14) warnings.push("сертификат истекает через " + host.certDays + " дн.");
    }
  }

  const status = problems.length ? "fail" : (warnings.length ? "warn" : "ok");
  const body = {status: status, problems: problems, warnings: warnings};
  if (detail){
    let students = null;
    try { students = (await kv.list({prefix: "student:"})).keys.length; } catch(e){}
    body.langsKb = langsKb;
    body.page = dry.ok ? {lang: dry.lang, chars: dry.chars} : null;
    body.host = host;
    body.students = students;
    body.time = new Date().toISOString();
  }
  return json(body, status === "fail" ? 503 : 200);
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
      if (p === "/api/lead" && req.method === "OPTIONS")
        return new Response(null, {status: 204, headers: corsHeaders(req)});
      if (p === "/api/lead" && req.method === "POST") return await apiLead(req, kv, env);
      if (p === "/api/admin/leads") return await adminLeads(url, kv, adminKey);
      if (p === "/api/progress" && req.method === "POST") return await apiProgress(req, url, kv);
      if (p === "/health") return await health(url, kv, env);
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




const LANG = {
  ru: {
    htmlLang: "ru",
    hLogo: '<span class="logo-mark"><img src="mayak.png" alt="" width="26" height="26"></span><span class="uh-txt">bcm.risk-<span class="logo-place">place</span>.ru</span>',
    hCta: "Связаться",
    hCtaHref: "https://bcm.risk-place.ru/quiz.html",
    siteUrl: "https://bcm.risk-place.ru/",
    "dash-shot": '<img src="dashboard-preview.jpg" alt="Дашборд непрерывности и рисков — интегральный индекс, стоимость дня простоя и статус планов" loading="lazy" class="dash-flag-img">',
    "i18n-hero-eyebrow": "Управление непрерывностью бизнеса · BCM / BCP",
    "i18n-hero-title": "Киберустойчивость и непрерывность бизнеса —<br><em>фундамент, который служит долгие годы.</em>",
    "i18n-hero-sub": "Кибератака, сбой ИТ, потеря поставщика — каждый из этих сценариев уже произошел с сотнями компаний. BCM (управление непрерывностью бизнеса) — это система, которая позволяет восстановить работу за часы, а не недели.",
    quizUrl: "https://bcm.risk-place.ru/quiz.html",
    "i18n-prob-eyebrow": "С чем мы помогаем",
    "i18n-prob-title": "Ситуации, в которых нужна непрерывность бизнеса",
    "i18n-proc-eyebrow": "Как выглядит работа",
    "i18n-proc-title": "От диагностики до работающей системы — 4 шага",
    "i18n-about-eyebrow": "Об эксперте",
    "i18n-cta-title": "Узнайте, насколько устойчив<br>ваш бизнес — <em>за 5 минут</em>",
    "i18n-cta-sub": "Бесплатный тест из 10 вопросов покажет уровень зрелости системы непрерывности бизнеса (BCM) вашей компании и конкретные зоны риска.",
    "i18n-cont-eyebrow": "Связаться",
    "i18n-cont-title": "Запишитесь на консультацию",
    "i18n-cont-desc": "",
    "i18n-cont-hint": "30 минут · Резюме на почту в течение 24 часов",
    "i18n-cont-also": "Или напишите напрямую",
    "contacts-calendly-btn": "Записаться на разбор →",
    "quote-author": "— Евгений Теленков, из практики BCM-консалтинга",
    "ct-phone": "Телефон / WhatsApp",
    "ct-tg": "Telegram",
    "ct-email": "Email",
    "ct-tc": "TenChat",
    "stat-n1": "1,5 трлн",
    "stat-n2": "47%",
    "stat-n3": "50 млн ₽",
    "stat-n4": "×3",
    "stat-l1": "рублей — ущерб от кибератак российскому бизнесу за 8 месяцев 2025 года",
    "stat-l2": "всех кибератак на российские компании привели к остановке деятельности в 2025 году",
    "stat-l3": "— минимальный совокупный ущерб от одной успешной атаки для среднего бизнеса",
    "stat-l4": "число атак выросло за год. И будет расти дальше — это не прогноз, это тренд",
    "stat-s1": "Источник: Solar 4RAYS, BI.ZONE — 2025",
    "stat-s2": "Источник: Solar 4RAYS / Ведомости",
    "stat-s3": "Источник: BI.ZONE, апрель 2026",
    "stat-s4": "Источник: Positive Technologies, 2025",
    "myth-lbl": "Ситуация",
    "truth-lbl": "Что делаем",
    "i18n-prob-desc": "ИТ-специалисты решают технические задачи. Но никто в компании не отвечает на вопрос: что произойдет с денежным потоком, если система встанет прямо сейчас?",
    "i18n-misc-hdr": "Три распространенных заблуждения",
    "myth1": "«Кибератака или сбой ИТ — и компания встала, деньги не идут»",
    "truth1": "Оцифровываем стоимость простоя, строим план восстановления с RTO/RPO и пошаговыми действиями для каждого сценария.",
    "myth2": "«Ушел ключевой человек или пропал поставщик — процесс остановился»",
    "truth2": "Находим точки концентрации риска, готовим резервные цепочки поставок и план замещения ключевых людей.",
    "myth3": "«Контрагент, банк или тендер требует план непрерывности или ISO 22301»",
    "truth3": "Разрабатываем BCP и систему по ISO 22301 — основу для соответствия требованиям контрагентов и сертификации.",
    "i18n-proc-desc": "Живая система — не методология на полке. Команда знает и умеет применять.",
    "proc-1-t": "Диагностика и BIA",
    "proc-1-d": "Определяем критичные процессы и оцениваем каждый в деньгах. Находим точки концентрации риска, которые вы, возможно, не замечали.",
    "proc-2-t": "Разработка BCP — плана непрерывности",
    "proc-2-d": "Создаем BCP (план непрерывности бизнеса) с конкретными шагами, ролями и сроками восстановления. Не шаблон — документ под вашу бизнес-модель.",
    "proc-3-t": "Учения и тестирование",
    "proc-3-d": "Проводим кабинетные учения и стресс-тесты. Только живая тренировка покажет, что реально работает, а что остается на бумаге.",
    "proc-4-t": "Поддержка и обновление",
    "proc-4-d": "Бизнес меняется — план тоже. Помогаем актуализировать BCM (систему непрерывности) при изменениях в компании и на рынке.",
    "ben-2-t": "Риски в деньгах",
    "ben-3-t": "Рабочие алгоритмы",
    "ben-4-t": "Обученная команда",
    "ben-4-d": "Каждый сотрудник знает свою роль в кризисе. Учения показывают пробелы до реального инцидента, а не во время него.",
    "ben-5-t": "Резервные цепочки",
    "ben-5-d": "Альтернативные поставщики, логистика, каналы коммуникации — задокументированные резервы, о которых вы могли не знать.",
    "ben-6-t": "Соответствие стандартам",
    "ben-6-d": "Система строится в логике ISO 22301 и ISO 27031 — основ международного BCM. Фундамент для сертификации при необходимости.",
    "about-name": "Евгений Теленков",
    "hKb": "Материалы по BCM",
    "hEdu": "Обучение и консалтинг",
    "about-more": "Все курсы и услуги — на risk-place.ru →",
    "footer-part": "Часть проекта risk-place.ru — обучение и консалтинг по управлению рисками",
    "kb-btn": "Все материалы →",
    "about-role": "Директор по рискам · Кандидат экономических наук",
    "tag1": "Билайн", "tag2": "Норникель", "tag3": "Роснефть", "tag4": "EY",
    "tag5": "Ростех", "tag6": "РусРиск 2020", "tag7": "BCM / BCP", "tag8": "ISO 22301",
    "about-t1": "20 лет в управлении рисками. Возглавлял риск-менеджмент в <strong>Билайне, Норникеле, Роснефти и EY</strong> — компаниях с принципиально разными масштабами, отраслями и культурой управления.",
    "about-t2": "Лично разработал <strong>планы непрерывности бизнеса</strong> для Норникеля, Ростеха, НРД и АСВ. Проводил BCM-аудиты, работал как с небольшими компаниями (50–200 человек), так и с корпорациями с десятками тысяч сотрудников.",
    "about-t3": "Обучил <strong>300+ специалистов</strong> по рискам и BCM в России и Казахстане. Разрабатывал корпоративные программы обучения, проводил учения и стресс-тесты с реальными инцидент-сценариями.",
    "about-t4": "<strong>«Лучший риск-менеджер России — 2020»</strong> по версии РусРиск. Заместитель председателя ТК-010 «Менеджмент риска» Росстандарта. Участвует в разработке национальных стандартов BCM.",
    "quote-text": "«Многие компании думают, что непрерывность бизнеса — это про резервные серверы. Настоящая устойчивость начинается не с ИТ — она начинается с понимания, где удар окажется самым болезненным для денежного потока.»",
    "hero-btn1": "Пройти диагностику бесплатно →",
    "hero-btn2": "Обсудить задачу",
    "cta-btn1": "Пройти диагностику бесплатно →",
    "cta-btn2": "Сразу к консультации",
    footerCopy: "© 2026 Risk-place · Управление непрерывностью бизнеса и рисками · <a href=\"https://risk-place.ru\" target=\"_blank\" rel=\"noopener\" style=\"color:inherit;\">часть проекта risk-place.ru</a>",
    // Paid session
    "paid-eyebrow": "Личный разбор · 30 минут",
    "paid-title": "Разбор вашей ситуации —<br>конкретный результат за 30 минут",
    "paid-sub": "Мы разберем вашу конкретную ситуацию и способы снижения риска.",
    "paid-p1": "Стоимость одного дня простоя вашего бизнеса — конкретная цифра в рублях",
    "paid-p2": "Три главных уязвимости, которые могут остановить ваш денежный поток",
    "paid-p3": "Первый конкретный шаг, который можно сделать уже на этой неделе",
    "paid-p4": "Резюме разбора — документ на одну страницу, который вы получите в течение 24 часов",
    "paid-m1-val": "30 минут",
    "paid-m1-lbl": "продолжительность",
    "paid-m2-val": "по заявке",
    "paid-m2-lbl": "стоимость",
    "paid-m3-val": "24 часа",
    "paid-m3-lbl": "резюме на почту",
    "paid-btn": "Записаться на разбор →",
    "paid-tg-text": "Или напишите напрямую в Telegram: ",
    // Quiz
    "quiz-eyebrow": "Не готовы платить сразу? Начните бесплатно",
    "quiz-title": "Пройдите диагностику за 5 минут",
    "quiz-desc": "13 вопросов — и вы узнаете уровень устойчивости вашего бизнеса, три главных риска и первые шаги. Бесплатно, результат сразу на экране.",
    "quiz-btn": "Пройти диагностику бесплатно →",
    "quiz-hint": "После диагностики вы можете вернуться и записаться на разбор — с пониманием конкретных пробелов",
    svgL: {
      title: "ИТ-ОТДЕЛ", sub: "Что защищает ваша IT-команда",
      l1h: "Антивирус и патчи", l1d: "Защита от вирусов, обновления ПО",
      l2h: "Файрвол и шифрование", l2d: "Защита периметра и данных",
      l3h: "Резервные копии", l3d: "Бэкапы данных и конфигураций",
      l4h: "Мониторинг сети", l4d: "Отслеживание инцидентов в ИТ"},
    svgR: {
      title: "ДЕНЕЖНЫЙ ПОТОК", sub: "Что остается без защиты",
      r1h: "Потеря выручки", r1d: "Простой = прямые финансовые убытки",
      r2h: "Срыв поставок", r2d: "Цепочка партнеров — не задокументирована",
      r3h: "Потеря клиентов", r3d: "Долгий простой = уход к конкуренту",
      r4h: "Репутационный ущерб", r4d: "Никто не готов — клиенты это видят"}},
  en: {
    "dash-shot": '<img src="dashboard-preview-en.jpg" alt="Business continuity dashboard — resilience index, cost of one day of downtime and plan status" loading="lazy" class="dash-flag-img">',
    htmlLang: "en",
    hLogo: '<span class="logo-mark"><img src="mayak.png" alt="" width="26" height="26"></span><span class="uh-txt">bcm.risk-<span class="logo-place">place</span>.ru</span>',
    hCta: "Get in Touch",
    hCtaHref: "https://bcm.risk-place.ru/quiz.html",
    siteUrl: "https://bcm.risk-place.ru/",
    "i18n-hero-eyebrow": "Business Continuity Management · BCM / BCP",
    "i18n-hero-title": "Cyber resilience and business continuity —<br><em>the foundation that serves for years to come.</em>",
    "i18n-hero-sub": "Cyberattack, IT failure, loss of a key supplier — each of these scenarios has already hit hundreds of companies. BCM (Business Continuity Management) is the system that lets you restore operations within hours, not weeks.",
    quizUrl: "https://bcm.risk-place.ru/quiz.html",
    "i18n-prob-eyebrow": "What we help with",
    "i18n-prob-title": "Situations where business continuity is needed",
    "i18n-proc-eyebrow": "How It Works",
    "i18n-proc-title": "From Diagnosis to a Working System — 4 Steps",
    "i18n-about-eyebrow": "About the Expert",
    "i18n-cta-title": "Discover How Resilient Your Business Is — <em>in 5 Minutes</em>",
    "i18n-cta-sub": "A free 10-question assessment will show your BCM maturity level and identify your specific risk zones.",
    "i18n-cont-eyebrow": "Contact",
    "i18n-cont-title": "Book Your Consultation",
    "i18n-cont-desc": "",
    "i18n-cont-hint": "30 minutes · Written summary within 24 hours",
    "i18n-cont-also": "Or write directly",
    "contacts-calendly-btn": "Book a review →",
    "quote-author": "— Evgeny Telenkov, from BCM consulting practice",
    "ct-phone": "Phone / WhatsApp",
    "ct-tg": "Telegram",
    "ct-email": "Email",
    "ct-tc": "TenChat",
    "stat-n1": "₽1.5 trln",
    "stat-n2": "47%",
    "stat-n3": "₽50 mln",
    "stat-n4": "×3",
    "stat-l1": "roubles — cyberattack losses to Russian business in 8 months of 2025",
    "stat-l2": "of all cyberattacks on Russian companies caused business interruption in 2025",
    "stat-l3": "— minimum total damage from one successful attack on a mid-sized business",
    "stat-l4": "cyberattack growth in a single year. And it keeps rising — this is a trend, not a spike",
    "stat-s1": "Source: Solar 4RAYS, BI.ZONE — 2025",
    "stat-s2": "Source: Solar 4RAYS / Vedomosti",
    "stat-s3": "Source: BI.ZONE, April 2026",
    "stat-s4": "Source: Positive Technologies, 2025",
    "myth-lbl": "Situation",
    "truth-lbl": "What we do",
    "i18n-prob-desc": "IT specialists handle technical tasks. But nobody in the company answers: what happens to our cash flow if the system goes down right now?",
    "i18n-misc-hdr": "Three Common Misconceptions",
    "myth1": "\"A cyberattack or IT outage — and the company stops, cash flow halts\"",
    "truth1": "We quantify downtime cost and build a recovery plan with RTO/RPO and step-by-step actions for each scenario.",
    "myth2": "\"A key person leaves or a supplier disappears — the process stalls\"",
    "truth2": "We find risk concentration points and prepare backup supply chains and a people-replacement plan.",
    "myth3": "\"A partner, bank or tender requires a continuity plan or ISO 22301\"",
    "truth3": "We develop a BCP and an ISO 22301-based system — the basis for compliance and certification.",
    "i18n-proc-desc": "A living system your team knows and can use — not a document on a shelf.",
    "proc-1-t": "Diagnosis & BIA",
    "proc-1-d": "We identify critical processes and value each one monetarily. We find risk concentration points you may not have noticed.",
    "proc-2-t": "BCP Development",
    "proc-2-d": "We create a BCP (Business Continuity Plan) with specific steps, roles and recovery timelines. Not a template — a document for your business model.",
    "proc-3-t": "Drills & Testing",
    "proc-3-d": "We run tabletop exercises and stress-tests. Only live training reveals what actually works versus what stays on paper.",
    "proc-4-t": "Support & Updates",
    "proc-4-d": "Business changes — so does the plan. We help keep your BCM system current as your company and market evolve.",
    "ben-2-t": "Risks Valued in Money",
    "ben-3-t": "Step-by-Step Playbooks",
    "ben-4-t": "Trained Team",
    "ben-4-d": "Every employee knows their role in a crisis. Drills reveal gaps before a real incident — not during one.",
    "ben-5-t": "Backup Chains",
    "ben-5-d": "Alternative suppliers, logistics, communication channels — documented reserves you may not have known about.",
    "ben-6-t": "Standards Compliance",
    "ben-6-d": "The system is built around ISO 22301 and ISO 27031 — the foundations of international BCM. A basis for certification when needed.",
    "about-name": "Evgeny Telenkov",
    "hKb": "BCM resources",
    "hEdu": "Training & consulting",
    "about-more": "All courses & services — at risk-place.ru →",
    "footer-part": "Part of risk-place.ru — training & consulting in risk management",
    "kb-btn": "All resources →",
    "about-role": "Risk Director · PhD in Economics",
    "tag1": "Beeline", "tag2": "Norilsk Nickel", "tag3": "Rosneft", "tag4": "EY",
    "tag5": "Rostec", "tag6": "RusRisk 2020", "tag7": "BCM / BCP", "tag8": "ISO 22301",
    "about-t1": "20 years in risk management. Led risk management at <strong>Beeline, Norilsk Nickel, Rosneft and EY</strong> — companies of fundamentally different scales, industries and governance cultures.",
    "about-t2": "Personally developed <strong>business continuity plans</strong> for Norilsk Nickel, Rostec, NSD and DIA. Conducted BCM audits, worked with companies from 50-person teams to corporations with tens of thousands of employees.",
    "about-t3": "Trained <strong>300+ specialists</strong> in risk management and BCM across Russia and Kazakhstan. Developed corporate training programmes, ran tabletop exercises and stress-tests with real incident scenarios.",
    "about-t4": "<strong>\"Best Risk Manager of Russia — 2020\"</strong> by RusRisk. Deputy Chair of TC-010 'Risk Management' at Rosstandart. Contributes to the development of national BCM standards.",
    "quote-text": "\"Many companies think business continuity is about backup servers. True resilience starts not with IT — it starts with understanding where a disruption will hit the cash flow hardest.\"",
    "hero-btn1": "Take Free Assessment →",
    "hero-btn2": "Discuss Your Challenge",
    "cta-btn1": "Take Free Assessment →",
    "cta-btn2": "Schedule a Consultation",
    footerCopy: "© 2026 Risk-place · Business continuity and risk management · <a href=\"https://risk-place.ru\" target=\"_blank\" rel=\"noopener\" style=\"color:inherit;\">part of the risk-place.ru project</a>",
    // Paid session
    "paid-eyebrow": "Personal review · 30 minutes",
    "paid-title": "Your Business Review —<br>A Concrete Result in 30 Minutes",
    "paid-sub": "Not a generic consultation. We will review your specific situation and risk mitigation options.",
    "paid-p1": "The cost of one day of downtime — a specific number in monetary terms",
    "paid-p2": "Three main vulnerabilities that could stop your cash flow",
    "paid-p3": "The first concrete step you can take this week",
    "paid-p4": "A one-page written summary delivered within 24 hours after the session",
    "paid-m1-val": "30 min",
    "paid-m1-lbl": "duration",
    "paid-m2-val": "on request",
    "paid-m2-lbl": "price",
    "paid-m3-val": "24 hrs",
    "paid-m3-lbl": "summary by email",
    "paid-btn": "Book Your Session →",
    "paid-tg-text": "Or message directly on Telegram: ",
    // Quiz
    "quiz-eyebrow": "Not ready to pay yet? Start for free",
    "quiz-title": "Take the 5-Minute Assessment",
    "quiz-desc": "13 questions — discover your business resilience level, three main risks and first steps. Free, results shown immediately.",
    "quiz-btn": "Take Free Assessment →",
    "quiz-hint": "After the assessment you can return and book a session — with a clear picture of your gaps",
    svgL: {
      title: "IT DEPARTMENT", sub: "What your IT team protects",
      l1h: "Antivirus & patches", l1d: "Malware protection, software updates",
      l2h: "Firewall & encryption", l2d: "Perimeter security and data protection",
      l3h: "Backup copies", l3d: "Data and configuration backups",
      l4h: "Network monitoring", l4d: "Tracking IT incidents in real time"},
    svgR: {
      title: "CASH FLOW", sub: "What remains unprotected",
      r1h: "Revenue loss", r1d: "Downtime = direct financial losses",
      r2h: "Supply chain failure", r2d: "Partner chain — not documented",
      r3h: "Customer loss", r3d: "Long downtime = clients go to competitors",
      r4h: "Reputational damage", r4d: "No plan visible — clients notice"}}
};
let currentLang = "ru";
(function(){
  var ru = ["ru","be","kk","ky","uz","uk","tg"];
  var list = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || navigator.userLanguage || ""];
  var hasRu = list.some(function(L){ L=(L||"").toLowerCase(); return ru.some(function(x){ return L.indexOf(x)===0; }); });
  currentLang = hasRu ? "ru" : "en";
})();
setLang(currentLang);
function setLang(lang) {
  currentLang = lang;
  var t = LANG[lang];
  document.documentElement.lang = t.htmlLang;
  document.getElementById("hLogo").innerHTML = t.hLogo;
  document.getElementById("hLogo").href = t.siteUrl;
  var hCta = document.getElementById("hCta");
  if (hCta) { hCta.textContent = t.hCta; hCta.href = t.hCtaHref; }
  var hBookBtn = document.getElementById("hBookBtn");
  if (hBookBtn) hBookBtn.textContent = t.hBookBtn;
  document.getElementById("btnRU").classList.toggle("active", lang === "ru");
  document.getElementById("btnEN").classList.toggle("active", lang === "en");
  var ids = [
    "i18n-hero-eyebrow","i18n-hero-title","i18n-hero-sub",
    "i18n-prob-eyebrow","i18n-prob-title",
    "i18n-proc-eyebrow","i18n-proc-title",
    "i18n-ben-eyebrow","i18n-ben-title",
    "i18n-about-eyebrow",
    "i18n-cta-title","i18n-cta-sub",
    "i18n-cont-eyebrow","i18n-cont-title","i18n-cont-desc","i18n-cont-hint","i18n-cont-also"
  ];
  ids.forEach(function(id) {
    var el = document.getElementById(id);
    if (el && t[id]) el.innerHTML = t[id];
  });
  var fc = document.getElementById("footer-copy");
  if (fc) fc.textContent = t.footerCopy;
  var extIds = [
    "stat-n1","stat-n2","stat-n3","stat-n4",
    "stat-l1","stat-l2","stat-l3","stat-l4",
    "stat-s1","stat-s2","stat-s3","stat-s4",
    "i18n-prob-desc","i18n-misc-hdr",
    "myth1","truth1","myth2","truth2","myth3","truth3",
    "i18n-proc-desc",
    "proc-1-t","proc-1-d","proc-2-t","proc-2-d",
    "proc-3-t","proc-3-d","proc-4-t","proc-4-d",
    "ben-1-title","ben-1-d","ben-2-t","ben-2-d",
    "ben-3-t","ben-3-d","ben-4-t","ben-4-d",
    "ben-5-t","ben-5-d","ben-6-t","ben-6-d",
    "about-role","about-t1","about-t2","about-t3","about-t4",
    "quote-text",
    // Paid session
    "paid-eyebrow","paid-title","paid-sub",
    "paid-p1","paid-p2","paid-p3","paid-p4",
    "paid-m1-val","paid-m1-lbl","paid-m2-val","paid-m2-lbl","paid-m3-val","paid-m3-lbl",
    "paid-tg-text",
    // Quiz
    "quiz-eyebrow","quiz-title","quiz-desc","quiz-hint",
    "contacts-calendly-btn","quote-author","ct-phone","ct-tg","ct-email","ct-li","ct-tc",
    "about-name","tag1","tag2","tag3","tag4","tag5","tag6","tag7","tag8","hKb",
    "kb-eyebrow","kb-title","kb-desc","kb-btn","hEdu","about-more","footer-part",
    "dash-shot"
  ];
  extIds.forEach(function(id) {
    var el = document.getElementById(id);
    if (el && t[id] !== undefined) el.innerHTML = t[id];
  });
  // Myth/truth labels (shared key, applied to all 3)
  ["myth-lbl1","myth-lbl2","myth-lbl3"].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.textContent = t["myth-lbl"] || (lang === "en" ? "Misconception" : "Заблуждение");
  });
  ["truth-lbl1","truth-lbl2","truth-lbl3"].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.textContent = t["truth-lbl"] || (lang === "en" ? "Reality" : "Реальность");
  });
  // Buttons
  var hb1 = document.getElementById("hero-btn1");
  var hb2 = document.getElementById("hero-btn2");
  var cb1 = document.getElementById("cta-btn1");
  var cb2 = document.getElementById("cta-btn2");
  var pb  = document.getElementById("paid-btn");
  var qb  = document.getElementById("quiz-btn");
  if (hb1) { hb1.textContent = t["hero-btn1"]; hb1.href = t.quizUrl; }
  if (hb2) hb2.textContent = t["hero-btn2"];
  if (cb1) { cb1.textContent = t["cta-btn1"]; cb1.href = t.quizUrl; }
  if (cb2) cb2.textContent = t["cta-btn2"];
  if (pb)  pb.textContent  = t["paid-btn"];
  if (qb)  { qb.textContent = t["quiz-btn"]; qb.href = t.quizUrl; }
  // SVG (guard: SVG section may be removed)
  if (t.svgL && t.svgR) {
    var svgMap = [
      ["svg-l-title", t.svgL.title], ["svg-l-sub", t.svgL.sub],
      ["svg-l1-h", t.svgL.l1h], ["svg-l1-d", t.svgL.l1d],
      ["svg-l2-h", t.svgL.l2h], ["svg-l2-d", t.svgL.l2d],
      ["svg-l3-h", t.svgL.l3h], ["svg-l3-d", t.svgL.l3d],
      ["svg-l4-h", t.svgL.l4h], ["svg-l4-d", t.svgL.l4d],
      ["svg-r-title", t.svgR.title], ["svg-r-sub", t.svgR.sub],
      ["svg-r1-h", t.svgR.r1h], ["svg-r1-d", t.svgR.r1d],
      ["svg-r2-h", t.svgR.r2h], ["svg-r2-d", t.svgR.r2d],
      ["svg-r3-h", t.svgR.r3h], ["svg-r3-d", t.svgR.r3d],
      ["svg-r4-h", t.svgR.r4h], ["svg-r4-d", t.svgR.r4d],
    ];
    svgMap.forEach(function(pair) {
      var el = document.getElementById(pair[0]);
      if (el) el.textContent = pair[1];
    });
  }
}


/* ── i18n: формы и блоки продуктов/путей ── */
var FORM_I18N = {
  ru:{ headApply:'Заявка на продукт', headWait:'Лист ожидания',
       subApply:'Оставьте контакты — свяжемся и расскажем детали, поможем оформить.',
       subWait:'Оставьте контакты — сообщим о старте первыми и дадим цену первого потока.',
       name:'Ваше имя', contact:'Email или телефон / Telegram', comment:'Комментарий (необязательно)',
       consent:'Я согласен с <a href="privacy-policy.html" target="_blank" rel="noopener" style="color:#1B3A5C;font-weight:600;">политикой конфиденциальности</a> и на обработку персональных данных',
       submitApply:'Отправить заявку', submitWait:'Записаться в лист ожидания',
       sending:'Отправляем…', ok:'Готово! Мы свяжемся с вами.',
       err:'Не удалось отправить. Попробуйте еще раз или напишите в Telegram.',
       need:'Заполните имя и контакт', needConsent:'Подтвердите согласие с политикой',
       headBuy:'Оформление покупки', subBuy:'Оставьте контакты — пришлем ссылку на оплату и доступ к продукту.', submitBuy:'Оформить покупку',
       sizePh:'Размер компании (необязательно)', sizes:['до 50 сотрудников','50–250 сотрудников','более 250 сотрудников'], concernPh:'Что беспокоит больше всего? (необязательно)' },
  en:{ headApply:'Product request', headWait:'Waitlist',
       subApply:'Leave your contact — we will reach out with details and help you get started.',
       subWait:'Leave your contact — we will tell you about the launch first and offer the first-cohort price.',
       name:'Your name', contact:'Email or phone / Telegram', comment:'Comment (optional)',
       consent:'I agree to the <a href="privacy-policy.html" target="_blank" rel="noopener" style="color:#1B3A5C;font-weight:600;">privacy policy</a> and to the processing of personal data',
       submitApply:'Send request', submitWait:'Join the waitlist',
       sending:'Sending…', ok:'Done! We will get in touch.',
       err:'Could not send. Please try again or message us on Telegram.',
       need:'Please fill in name and contact', needConsent:'Please confirm consent to the policy',
       headBuy:'Order', subBuy:'Leave your contact — we will send a payment link and product access.', submitBuy:'Place order',
       sizePh:'Company size (optional)', sizes:['up to 50 employees','50–250 employees','250+ employees'], concernPh:'What worries you most? (optional)' }
};
function fLang(){ return (typeof currentLang!=='undefined' && currentLang==='en') ? 'en':'ru'; }
var wlProd='', wlMode='apply';
function openForm(prod,label,mode){
  var t=FORM_I18N[fLang()]; wlProd=prod; wlMode=mode||'apply';
  document.getElementById('wlHead').textContent = (wlMode==='wait')?t.headWait:((wlMode==='buy')?t.headBuy:t.headApply);
  document.getElementById('wlProduct').textContent = label||prod;
  document.getElementById('wlSub').textContent = (wlMode==='wait')?t.subWait:((wlMode==='buy')?t.subBuy:t.subApply);
  document.getElementById('wlName').placeholder=t.name;
  document.getElementById('wlContact').placeholder=t.contact;
  var _q=document.getElementById('wlQual');
  if(_q){ _q.style.display=(wlMode==='buy')?'none':'block';
    var _cc=document.getElementById('wlConcern'); _cc.placeholder=t.concernPh; _cc.value=''; }
  document.getElementById('wlConsentText').innerHTML=t.consent;
  document.getElementById('wlSubmit').textContent=(wlMode==='wait')?t.submitWait:((wlMode==='buy')?t.submitBuy:t.submitApply);
  document.getElementById('wlName').value='';document.getElementById('wlContact').value='';
  document.getElementById('wlConsent').checked=false;
  document.getElementById('wlNote').style.display='none';document.getElementById('wlOk').style.display='none';document.getElementById('wlErr').style.display='none';
  document.getElementById('wlSubmit').disabled=false;
  document.getElementById('wlOverlay').style.display='flex'; document.body.style.overflow='hidden';
}
function closeForm(){ document.getElementById('wlOverlay').style.display='none'; document.body.style.overflow=''; }
document.getElementById('wlClose').addEventListener('click',closeForm);
document.getElementById('wlOverlay').addEventListener('click',function(e){ if(e.target===this) closeForm(); });
document.querySelectorAll('.np-form').forEach(function(b){
  b.addEventListener('click',function(){
    var card=this.closest('.prod-card');
    var label=card?card.querySelector('h3').textContent.trim():this.getAttribute('data-prod');
    openForm(this.getAttribute('data-prod'),label,this.getAttribute('data-mode'));
  });
});
document.getElementById('wlSubmit').addEventListener('click',async function(){
  var t=FORM_I18N[fLang()];
  var name=document.getElementById('wlName').value.trim();
  var contact=document.getElementById('wlContact').value.trim();
  var comment='';
  var qsize='';
  var qconcern=(wlMode!=='buy')?document.getElementById('wlConcern').value.trim():'';
  var consent=document.getElementById('wlConsent').checked;
  var note=document.getElementById('wlNote'),ok=document.getElementById('wlOk'),err=document.getElementById('wlErr');
  if(!name||!contact){ err.textContent=t.need; err.style.display='block'; return; }
  if(!consent){ err.textContent=t.needConsent; err.style.display='block'; return; }
  err.style.display='none'; this.disabled=true; note.textContent=t.sending; note.style.display='block';
  var _extra=[]; if(qsize)_extra.push('Размер компании: '+qsize); if(qconcern)_extra.push('Беспокоит: '+qconcern);
  var _fc=[comment].concat(_extra).filter(Boolean).join('\n')||'—';
  var _ft=(wlMode==='wait')?'Заявка в лист ожидания (новый продукт)':((wlMode==='buy')?'Оформление покупки':'Заявка на продукт');
  var _dp=(wlMode==='wait')?'Лист ожидания: ':((wlMode==='buy')?'Покупка: ':'Заявка: ');
  var body={ formTitle:_ft,
    name:name, company:contact, email:'—', product:wlProd, comment:_fc,
    companySize:qsize||'—', concern:qconcern||'—',
    description:_dp+wlProd+(_extra.length?(' | '+_extra.join(' | ')):''), language:fLang().toUpperCase() };
  try{
    var res=await fetch('https://ergp.risk-place.org/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    var r=await res.json(); if(!res.ok||!(r.success||r.ok)) throw new Error('fail');
    note.style.display='none'; ok.textContent=t.ok; ok.style.display='block'; setTimeout(closeForm,1600);
  }catch(e){ note.style.display='none'; err.textContent=t.err; err.style.display='block'; this.disabled=false; }
});

/* ── PATCH i18n: пути + продукты + nav + about-short ── */
var PATCH_LANG = {
 ru:{
  'risk-lbl':'УРОВЕНЬ УГРОЗЫ · НИЗКИЙ','hAbout':'О нас','hProd':'Продукты','hContLink':'Контакты','hKb':'Материалы','hCta':'Диагностика','trust-txt':'Практику ведут три признанных эксперта — риск-менеджмент, устойчивость и комплаенс','trust-more':'Наши эксперты →','kb-btn':'Все материалы по категориям →','float-free-btn':'⚡ Диагностика бесплатно','float-paid-btn':'Личный разбор →','hero-train-pre':'Нужно глубже? ','hero-train-link':'Курс по непрерывности бизнеса →',
  'paths-label':'С чего начать',
  'paths-free-badge':'БЕСПЛАТНО','paths-free-title':'Диагностика за 5 минут','paths-free-desc':'13 вопросов — и вы узнаете уровень устойчивости, три главных риска и первые шаги.','pf1':'Результат сразу на экране','pf2':'Три главных зоны риска','pf3':'Первые шаги — конкретно','paths-free-btn':'Провести диагностику бесплатно →',
  'paths-paid-badge':'По заявке','paths-paid-title':'Личный разбор · 30 минут','paths-paid-desc':'Мы разберем вашу конкретную ситуацию и способы снижения риска.','pp1':'Стоимость дня простоя в рублях','pp2':'Три главных уязвимости','pp3':'Резюме за 24 часа на почту','paths-paid-btn':'Записаться →',
  'paths-train-badge':'Обучение · от 20 000 ₽','paths-train-title':'Курс по непрерывности (BCP)','paths-train-desc':'6 модулей, 16 часов. Для руководителей и собственников — внедрить непрерывность системно.','ptr1':'BIA, BCP, кризисное управление','ptr2':'Реальные кейсы и практика','ptr3':'Сертификат по итогам','paths-train-btn':'Узнать о курсе →',
  'pr-eyebrow':'Продукты по непрерывности','pr-title':'Выберите формат под вашу задачу','pr-desc':'От готовых шаблонов до корпоративного внедрения и сертификации. Каждый продукт можно взять отдельно.','pr-foot':'Курс с преподавателем (BCP, 6 модулей) — на risk-place.ru.','pr-rec':'Рекомендуем',
  'pr1-b':'С этого начать','pr1-t':'Пакет шаблонов «BCM-старт»','pr1-d':'Готовые шаблоны BCP, BIA, DRP, реестр процессов и чек-лист + мини-курс «как пользоваться».','pr1-p':'4 900 ₽','pr1-more':'Подробнее →','pr1-btn':'Купить →',
  'pr2-b':'Онлайн','pr2-t':'Онлайн-курс «Непрерывность и ISO 22301»','pr2-d':'Самостоятельный курс с доступом сразу после оплаты: BIA, BCP, DRP, учения. Сертификат по итогам.','pr2-p':'19 900 ₽','pr2-more':'Подробнее →','pr2-btn':'Купить →',
  'pr3-b':'2 дня · с экспертом','pr3-t':'Стресс-тест непрерывности бизнеса','pr3-d':'Диагностика 100+ вопросов, стресс-симуляция «шифровальщик», заключение для ГД: ущерб в деньгах и план на 90 дней.','pr3-p':'390 000 ₽ · фикс за 2 дня','pr3-more':'Подробнее →','pr3-btn':'Отправить заявку',
  'pr4-b':'Корпоративно','pr4-t':'«BCM под ключ»','pr4-d':'Аудит непрерывности, разработка плана, кризисные учения и сопровождение. Внедрение под ключ.','pr4-p':'от 300 000 ₽','pr4-more':'Подробнее →','pr4-btn':'Отправить заявку',
  'pr5-b':'Скоро · осень 2026','pr5-t':'Сертификация «Специалист по непрерывности»','pr5-d':'Авторская программа подготовки и сертификат — нишевая сертификация по BCM. В разработке.','pr5-p':'Запись открыта','pr5-btn':'Записаться в лист ожидания',
  'pr6-b':'Новое','pr6-t':'Дашборд непрерывности и рисков','pr6-d':'Панель мониторинга устойчивости в реальном времени: индекс, риски, статус планов и метрики.','pr6-p':'Цена — по итогам демонстрации','pr6-more':'Подробнее →','pr6-btn':'Заказать демонстрацию',
  'grp1':'Самостоятельно · быстрый старт без нас','grp2':'С экспертом · практика и внедрение вместе','grp3':'Корпоративно · системно, под ключ','pr1-for':'Для кого: малый бизнес и те, кто внедряет BCM сам','pr2-for':'Для кого: руководители и специалисты — разобраться системно','pr3-for':'Для кого: руководители, которым нужен вердикт и план, а не долгий консалтинг','pr6-for':'Для кого: риск-менеджеры и советы директоров — устойчивость в цифрах','pr4-for':'Для кого: средний и крупный бизнес — внедрение под ключ','pr5-for':'Для кого: специалисты, кому нужен подтвержденный статус',
  'about-short':'20 лет в управлении рисками: Билайн, Норникель, Роснефть, EY. «Лучший риск-менеджер России — 2020» по версии РусРиск, зампред ТК-010 «Менеджмент риска» Росстандарта. Лично разрабатывал планы непрерывности для Норникеля, Ростеха, НРД и АСВ, обучил 300+ специалистов.','about-more':'Подробнее о подходе и эксперте →'
 },
 en:{
  'risk-lbl':'THREAT LEVEL · LOW','hAbout':'About us','hProd':'Products','hContLink':'Contacts','hKb':'Materials','hCta':'Assessment','trust-txt':'Evgeny Telenkov — Beeline · Nornickel · Rosneft · EY · Best Risk Manager of Russia 2020','trust-more':'About us →','kb-btn':'All materials by category →','float-free-btn':'⚡ Free Assessment','float-paid-btn':'Personal review →','hero-train-pre':'Want to go deeper? ','hero-train-link':'Business continuity course →',
  'paths-label':'Where to start',
  'paths-free-badge':'FREE','paths-free-title':'5-Minute Assessment','paths-free-desc':'13 questions — discover your resilience level, three main risks and first steps.','pf1':'Results on screen instantly','pf2':'Three main risk zones','pf3':'Concrete first steps','paths-free-btn':'Run Free Assessment →',
  'paths-paid-badge':'On request','paths-paid-title':'Personal Review · 30 min','paths-paid-desc':'We will review your specific situation and risk mitigation options.','pp1':'Daily downtime cost in monetary terms','pp2':'Three main vulnerabilities','pp3':'Written summary within 24 hrs','paths-paid-btn':'Book now →',
  'paths-train-badge':'Training · from $200','paths-train-title':'Business Continuity Course (BCP)','paths-train-desc':'6 modules, 16 hours. For executives and owners — implement continuity systematically.','ptr1':'BIA, BCP, crisis management','ptr2':'Real cases and practice','ptr3':'Certificate on completion','paths-train-btn':'About the course →',
  'pr-eyebrow':'Business continuity products','pr-title':'Choose the format for your task','pr-desc':'From ready templates to corporate implementation and certification. Each product can be taken separately.','pr-foot':'Instructor-led course (BCP, 6 modules) — on risk-place.ru.','pr-rec':'Recommended',
  'pr1-b':'Start here','pr1-t':'Template pack "BCM Start"','pr1-d':'Ready BCP, BIA, DRP templates, process register and checklist + a mini-course on how to use them.','pr1-p':'$49','pr1-more':'Details →','pr1-btn':'Buy →',
  'pr2-b':'Online','pr2-t':'Online course "Continuity & ISO 22301"','pr2-d':'Self-paced course with instant access after payment: BIA, BCP, DRP, drills. Certificate on completion.','pr2-p':'$199','pr2-more':'Details →','pr2-btn':'Buy →',
  'pr3-b':'2 days · expert-led','pr3-t':'Business continuity stress test','pr3-d':'A 100+ question diagnostic, a ransomware stress simulation, a CEO report: damage in money and a 90-day plan.','pr3-p':'390,000 RUB · fixed, 2 days','pr3-more':'Details →','pr3-btn':'Send request',
  'pr4-b':'Corporate','pr4-t':'"BCM audit and development"','pr4-d':'Continuity audit, plan development, crisis drills and support. Full implementation.','pr4-p':'from $3,000','pr4-more':'Details →','pr4-btn':'Send request',
  'pr5-b':'Coming · autumn 2026','pr5-t':'Certification "Continuity Specialist"','pr5-d':'Author-led training program and certificate — a niche BCM certification. In development.','pr5-p':'Waitlist open','pr5-btn':'Join the waitlist',
  'pr6-b':'New','pr6-t':'Continuity & Risk Dashboard','pr6-d':'Real-time resilience monitoring: index, risks, plan status and metrics.','pr6-p':'Pricing — after the demo','pr6-more':'Details →','pr6-btn':'Request a demo',
  'grp1':'Self-service · quick start without us','grp2':'With an expert · practice and rollout together','grp3':'Corporate · systematic, turnkey','pr1-for':'For: small business and DIY BCM teams','pr2-for':'For: managers and specialists — a systematic grasp','pr3-for':'For: executives who want a verdict and a plan, not endless consulting','pr6-for':'For: risk managers and boards — resilience in numbers','pr4-for':'For: mid and large business — turnkey implementation','pr5-for':'For: specialists who need a certified status',
  'about-short':'20 years in risk management: Beeline, Nornickel, Rosneft, EY. "Best Risk Manager of Russia 2020" (RusRisk), deputy chair of Rosstandart TC-010 "Risk Management". Personally built continuity plans for Nornickel, Rostec, NSD and DIA, trained 300+ specialists.','about-more':'More about the approach and expert →'
 }
};
var _origSetLang = window.setLang;
window.setLang = function(lang){
  if(_origSetLang) _origSetLang(lang);
  var t = PATCH_LANG[lang] || PATCH_LANG.ru;
  Object.keys(t).forEach(function(id){ var el=document.getElementById(id); if(el) el.textContent=t[id]; });
};
(function(){ var l=(document.documentElement.lang==='en')?'en':'ru'; if(window.setLang) window.setLang(l); })();

/* bcm.risk-place.ru · главная · сценарии страницы (v3, 05.09.2026)
   1) язык RU/EN на месте: тексты в data-ru/data-en, подсказки полей в data-phru/data-phen;
   2) поиск по библиотеке; 3) форма заявки; 4) уведомление о cookie.
   Оформление здесь не живет: все стили в site.css. */
(function () {
  var LANGS = { ru: 'ru', en: 'en-RU' };

  function apply(lang) {
    document.documentElement.lang = LANGS[lang] || 'ru';
    document.querySelectorAll('[data-ru],[data-en]').forEach(function (el) {
      var v = el.getAttribute('data-' + lang);
      if (v != null) el.innerHTML = v;
    });
    document.querySelectorAll('[data-phru]').forEach(function (el) {
      el.setAttribute('placeholder', el.getAttribute(lang === 'en' ? 'data-phen' : 'data-phru'));
    });
    var ru = document.getElementById('btnRU'), en = document.getElementById('btnEN');
    if (ru && en) { ru.classList.toggle('act', lang === 'ru'); en.classList.toggle('act', lang === 'en'); }
    try { localStorage.setItem('bcmLang', lang); } catch (e) {}
    document.title = lang === 'en'
      ? 'Business continuity: ERGP certification, SAFE programme, dashboard and turnkey system'
      : 'Непрерывность бизнеса: сертификация ERGP, программа SAFE, дашборд и система под ключ';
  }
  window.setLang = function (lang) { apply(lang === 'en' ? 'en' : 'ru'); return false; };

  function initial() {
    try { var s = localStorage.getItem('bcmLang'); if (s === 'ru' || s === 'en') return s; } catch (e) {}
    var q = (location.search.match(/[?&]lang=(ru|en)/) || [])[1];
    if (q) return q;
    var list = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || ''];
    var ruish = ['ru', 'be', 'kk', 'ky', 'uz', 'uk', 'tg'];
    var hasRu = list.some(function (L) { L = (L || '').toLowerCase(); return ruish.some(function (x) { return L.indexOf(x) === 0; }); });
    return hasRu ? 'ru' : 'en';
  }

  function lang() { return document.documentElement.lang.indexOf('en') === 0 ? 'en' : 'ru'; }

  function ready() {
    apply(initial());
    /* кнопка ≡: обработчик приходит с подвалом (sync_template v3), здесь его нет,
       иначе два обработчика гасят друг друга (урок 05.09.2026) */

    /* поиск по библиотеке */
    var sf = document.getElementById('mform');
    if (sf) sf.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = (document.getElementById('mq').value || '').trim();
      try { gtag('event', 'library_search', { page: 'home', q: q }); } catch (x) {}
      location.href = 'materialy.html' + (q ? ('?q=' + encodeURIComponent(q)) : '');
    });

    /* форма заявки: единая форма трех сайтов (leadform.py, 26.10.2026) */
    var lfb = document.getElementById("lfSubmit"), lfs = document.getElementById("lfTopic");
    document.querySelectorAll("[data-topic]").forEach(function (a) { a.addEventListener("click", function () { if (lfs) { lfs.value = a.getAttribute("data-topic"); if (lfs.selectedIndex < 0) lfs.selectedIndex = 0; } }); });
    if (lfb) lfb.addEventListener("click", function (e) {
      e.preventDefault();
      var l = lang(), out = document.getElementById("lfOut");
      function say(kind, ru, en) { out.className = "fmsg " + kind; out.textContent = l === "en" ? en : ru; }
      function v(id) { var el = document.getElementById(id); return el ? el.value.trim() : ""; }
      var name = v("lfName"), org = v("lfOrg"), email = v("lfEmail"), phone = v("lfPhone");
      var topic = lfs && lfs.selectedIndex >= 0 ? lfs.options[lfs.selectedIndex].text : "";
      if (!name || !org || email.indexOf("@") < 1) { say("err", "Заполните имя, компанию и рабочую почту.", "Please fill in your name, company and work email."); return; }
      if (phone && phone.replace(/\D/g, "").length < 7) { say("err", "Проверьте номер телефона.", "Please check the phone number."); return; }
      if (!document.getElementById("lfConsent").checked) { say("err", "Отметьте согласие на обработку персональных данных.", "Please tick the consent to the processing of personal data."); return; }
      lfb.disabled = true;
      say("note", "Отправляем…", "Sending…");
      var body = { type: "demo", product: "home", source: "ru", name: name, email: email, org: org, phone: phone, role: "", formTitle: topic,
        message: "[" + topic + "]" + (phone ? " · " + (l === "en" ? "Phone" : "Телефон") + ": " + phone : ""), lang: l, page: l === "en" ? "en-home" : "ru-home" };
      fetch("https://ergp.risk-place.org/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
        .then(function (r) {
          if (!r.ok) throw 0;
          say("ok", "Спасибо! Ответим в течение рабочего дня.", "Thank you! We will reply within one working day.");
          try { ym(110579884, "reachGoal", "ru_home_lead_submit"); } catch (x) {}
          try { gtag("event", "ru_home_lead_submit"); } catch (x) {}
        })
        .catch(function () { say("err", "Не получилось отправить. Напишите нам: info@risk-place.ru", "Could not send. Please write to us: info@risk-place.ru"); lfb.disabled = false; });
    });

    /* cookie */
    try {
      if (!localStorage.getItem('ckAck')) {
        var bar = document.getElementById('ckBar'); if (bar) bar.hidden = false;
        var ok = document.getElementById('ckOk');
        if (ok) ok.addEventListener('click', function () { try { localStorage.setItem('ckAck', '1'); } catch (e) {} bar.hidden = true; });
      }
    } catch (e) {}
  }
  if (document.readyState !== 'loading') ready(); else document.addEventListener('DOMContentLoaded', ready);
})();

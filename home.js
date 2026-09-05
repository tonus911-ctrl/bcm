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
    var b = document.querySelector('.uh-burger');
    if (b) b.addEventListener('click', function () { document.getElementById('uhNav').classList.toggle('open'); });

    /* поиск по библиотеке */
    var sf = document.getElementById('mform');
    if (sf) sf.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = (document.getElementById('mq').value || '').trim();
      try { gtag('event', 'library_search', { page: 'home', q: q }); } catch (x) {}
      location.href = 'materialy.html' + (q ? ('?q=' + encodeURIComponent(q)) : '');
    });

    /* форма заявки */
    var btn = document.getElementById('cf-send');
    if (btn) btn.addEventListener('click', function (e) {
      e.preventDefault();
      var l = lang(), note = document.getElementById('cf-note');
      function say(kind, ru, en) { note.className = 'fmsg ' + kind; note.textContent = l === 'en' ? en : ru; }
      var name = document.getElementById('cf-name').value.trim();
      var email = document.getElementById('cf-email').value.trim();
      if (!name || email.indexOf('@') < 0) { say('err', 'Заполните имя и рабочую почту.', 'Please fill in your name and work email.'); return; }
      var cons = document.getElementById('cf-consent');
      if (cons && !cons.checked) { say('err', 'Отметьте согласие на обработку персональных данных.', 'Please tick the consent box.'); return; }
      var body = { type: 'demo', product: document.getElementById('cf-product').value, source: 'ru', name: name, email: email,
        org: document.getElementById('cf-org').value.trim(), role: '', message: document.getElementById('cf-msg').value.trim(), lang: l, page: 'ru-home' };
      say('note', 'Отправляем…', 'Sending…');
      fetch('https://ergp.risk-place.org/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        .then(function (r) {
          if (!r.ok) throw 0;
          say('ok', 'Спасибо! Ответим в течение рабочего дня и предложим следующий шаг.', 'Thank you! We reply within one business day with a proposed next step.');
          try { ym(110579884, 'reachGoal', 'ru_home_lead_submit'); } catch (x) {}
          try { gtag('event', 'ru_home_lead_submit', { product: body.product }); } catch (x) {}
        })
        .catch(function () { say('err', 'Не получилось отправить. Напишите нам: info@risk-place.ru', 'Could not send. Please email info@risk-place.ru'); });
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

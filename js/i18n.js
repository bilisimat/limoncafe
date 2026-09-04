/* =========================================================
   Limos Kahvaltı — çoklu dil (TR / EN / AR / DE)
   Strateji: orijinal Türkçe metin anahtar olarak tutulur,
   sözlükte karşılığı yoksa metin Türkçe kalır (no-op).
   ========================================================= */
(function () {
  "use strict";

  var STORAGE_KEY = "limosLang";
  var LANGS = ["tr", "en", "ar", "de"];
  var LANG_LABEL = { tr: "TR", en: "EN", ar: "AR", de: "DE" };
  var LANG_NAME = {
    tr: "Türkçe", en: "English", ar: "العربية", de: "Deutsch"
  };

  /* ---------- Genel arayüz metinleri (menü + ortak) ---------- */
  var TEXT = {
    "İçeriğe geç": { en: "Skip to content", de: "Zum Inhalt springen", ar: "الانتقال إلى المحتوى" },
    "Kahvaltı": { en: "Breakfast", de: "Frühstück", ar: "الفطور" },
    "Menü": { en: "Menu", de: "Speisekarte", ar: "القائمة" },
    "Galeri": { en: "Gallery", de: "Galerie", ar: "المعرض" },
    "Yorumlar": { en: "Reviews", de: "Bewertungen", ar: "التقييمات" },
    "İletişim": { en: "Contact", de: "Kontakt", ar: "تواصل" },
    "Rezervasyon & Bilgi": { en: "Reservation & Info", de: "Reservierung & Info", ar: "الحجز والمعلومات" },
    "Yol Tarifi": { en: "Directions", de: "Route", ar: "الاتجاهات" },
    "Bizi Arayın": { en: "Call Us", de: "Anrufen", ar: "اتصل بنا" },
    "Menüyü aç / kapat": { en: "Open / close menu", de: "Menü öffnen / schließen", ar: "فتح / إغلاق القائمة" },
    "Yukarı çık": { en: "Back to top", de: "Nach oben", ar: "العودة للأعلى" },
    "Kapat": { en: "Close", de: "Schließen", ar: "إغلاق" },
    "Hızlı erişim": { en: "Quick access", de: "Schnellzugriff", ar: "الوصول السريع" },
    "Ana menü": { en: "Main menu", de: "Hauptmenü", ar: "القائمة الرئيسية" },
    "Kategoriler arası gezinme": { en: "Navigate between categories", de: "Zwischen Kategorien wechseln", ar: "التنقل بين الفئات" },
    "Ara": { en: "Call", de: "Anrufen", ar: "اتصال" },
    "Konum": { en: "Location", de: "Standort", ar: "الموقع" },
    "Masada görüşürüz.": { en: "See you at the table.", de: "Wir sehen uns am Tisch.", ar: "نراكم على المائدة." },
    "Beşiktaş Sinanpaşa'da, kahvaltı sokağında. Serpme ve à la carte kahvaltı, taze pişiler ve demli çay.": {
      en: "In Beşiktaş Sinanpaşa, on breakfast street. Sharing and à la carte breakfast, fresh pişi and brewed tea.",
      de: "In Beşiktaş Sinanpaşa, in der Frühstücksstraße. Serpme- und à-la-carte-Frühstück, frisches Pişi und aufgebrühter Tee.",
      ar: "في سينان باشا ببشيكطاش، في شارع الفطور. فطور سربمة وأطباق فردية، بيشي طازج وشاي مغلي."
    },
    "Keşfet": { en: "Explore", de: "Entdecken", ar: "استكشف" },
    "Alt menü": { en: "Footer menu", de: "Fußzeilenmenü", ar: "قائمة إضافية" },
    "Her gün · 18:00'de kapanır": { en: "Open daily · closes at 18:00", de: "Täglich geöffnet · schließt um 18:00 Uhr", ar: "يومياً · يُغلق الساعة ١٨:٠٠" },
    "Tüm hakları saklıdır.": { en: "All rights reserved.", de: "Alle Rechte vorbehalten.", ar: "جميع الحقوق محفوظة." },
    "Google Haritalar'da aç": { en: "Open in Google Maps", de: "In Google Maps öffnen", ar: "افتح في خرائط جوجل" },
    "Instagram — @limoskahvalti": { en: "Instagram — @limoskahvalti", de: "Instagram — @limoskahvalti", ar: "إنستغرام — @limoskahvalti" },

    /* menu.html */
    "Sofradaki her şey.": { en: "Everything on the table.", de: "Alles, was auf den Tisch gehört.", ar: "كل ما تحتاجه على المائدة." },
    "Serpme tabaklarda ilk çay ikramımızdır. Bir kategori seçin.": {
      en: "First tea is on us with sharing plates. Choose a category.",
      de: "Bei Serpme-Tellern geht der erste Tee auf uns. Wählen Sie eine Kategorie.",
      ar: "الشاي الأول ضيافة منّا مع أطباق سربمة. اختر فئة."
    },

    /* kategori sayfası ortak parçalar */
    "← Tüm menü": { en: "← All menu", de: "← Ganzes Menü", ar: "← كل القائمة" },
    "Kategoriler": { en: "Categories", de: "Kategorien", ar: "الفئات" },
    "← Önceki": { en: "← Previous", de: "← Zurück", ar: "→ السابق" },
    "Sonraki →": { en: "Next →", de: "Weiter →", ar: "التالي ←" },

    /* breadcrumb (Menü · 0X / 10) */
    "Menü · 01 / 10": { en: "Menu · 01 / 10", de: "Speisekarte · 01 / 10", ar: "القائمة · ٠١ / ١٠" },
    "Menü · 02 / 10": { en: "Menu · 02 / 10", de: "Speisekarte · 02 / 10", ar: "القائمة · ٠٢ / ١٠" },
    "Menü · 03 / 10": { en: "Menu · 03 / 10", de: "Speisekarte · 03 / 10", ar: "القائمة · ٠٣ / ١٠" },
    "Menü · 04 / 10": { en: "Menu · 04 / 10", de: "Speisekarte · 04 / 10", ar: "القائمة · ٠٤ / ١٠" },
    "Menü · 05 / 10": { en: "Menu · 05 / 10", de: "Speisekarte · 05 / 10", ar: "القائمة · ٠٥ / ١٠" },
    "Menü · 06 / 10": { en: "Menu · 06 / 10", de: "Speisekarte · 06 / 10", ar: "القائمة · ٠٦ / ١٠" },
    "Menü · 07 / 10": { en: "Menu · 07 / 10", de: "Speisekarte · 07 / 10", ar: "القائمة · ٠٧ / ١٠" },
    "Menü · 08 / 10": { en: "Menu · 08 / 10", de: "Speisekarte · 08 / 10", ar: "القائمة · ٠٨ / ١٠" },
    "Menü · 09 / 10": { en: "Menu · 09 / 10", de: "Speisekarte · 09 / 10", ar: "القائمة · ٠٩ / ١٠" },
    "Menü · 10 / 10": { en: "Menu · 10 / 10", de: "Speisekarte · 10 / 10", ar: "القائمة · ١٠ / ١٠" },

    /* pişiler h1 (nested <small>) */
    "Pişiler <small>(4 Adet)</small>": { en: "Pişi <small>(4 pcs)</small>", de: "Pişi <small>(4 Stück)</small>", ar: "بيشي <small>(٤ قطع)</small>" }
  };


  /* ---------- Yardımcılar ---------- */
  function getLang() {
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      if (v && LANGS.indexOf(v) > -1) return v;
    } catch (e) {}
    return "tr";
  }
  function setLang(v) {
    try { localStorage.setItem(STORAGE_KEY, v); } catch (e) {}
  }

  function lookupText(orig, lang) {
    var e = TEXT[orig];
    if (e && e[lang]) return e[lang];
    return orig;
  }
  /* Element(ler)i tara: çocuğu yoksa textContent, varsa innerHTML üzerinden çevir. */
  function translateEls(nodeList, lang) {
    nodeList.forEach(function (el) {
      if (el.children.length === 0) {
        if (el.dataset.i18nOrig === undefined) el.dataset.i18nOrig = el.textContent;
        el.textContent = lookupText(el.dataset.i18nOrig, lang);
      } else {
        if (el.dataset.i18nOrig === undefined) el.dataset.i18nOrig = el.innerHTML;
        var e = TEXT[el.dataset.i18nOrig.trim()];
        if (e && e[lang]) el.innerHTML = e[lang];
        else if (lang === "tr") el.innerHTML = el.dataset.i18nOrig;
      }
    });
  }

  /* Sadece son metin düğümünü çevir (footer copyright satırı için) */
  function translateTrailingText(nodeList, lang) {
    nodeList.forEach(function (el) {
      for (var i = el.childNodes.length - 1; i >= 0; i--) {
        var n = el.childNodes[i];
        if (n.nodeType === 3 && n.textContent.trim()) {
          if (el.dataset.i18nTrail === undefined) el.dataset.i18nTrail = n.textContent;
          var orig = el.dataset.i18nTrail;
          var e = TEXT[orig.trim()];
          n.textContent = (e && e[lang]) ? e[lang] : orig;
          break;
        }
      }
    });
  }

  function translateAttr(selector, attr, lang) {
    document.querySelectorAll(selector).forEach(function (el) {
      var key = "i18nAttr" + attr.replace(/[^a-zA-Z0-9]/g, "");
      if (el.dataset[key] === undefined) el.dataset[key] = el.getAttribute(attr) || "";
      var orig = el.dataset[key];
      el.setAttribute(attr, lookupText(orig, lang));
    });
  }

  /* Kategori/ürün içeriği artık menu-render.js tarafından, /api/menu'den
     gelen çok dilli veriyle doğrudan render ediliyor (bkz. o dosya). */

  /* ---------- Ana uygulama fonksiyonu ---------- */
  function applyLang(lang) {
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");

    var commonSel = [
      "#main-nav a", ".header-phone", ".header-cta", ".skip-link",
      ".footer-cta", ".footer-brand p", ".footer-col nav a", ".footer-col h4",
      ".footer-col p:not(.footer-addr)", ".footer-bottom a",
      ".mobile-bar span", ".cat-side-label", ".cat-back",
      ".cat-prevnext a > span",
      ".menu-hero:not(.cat-hero) .sec-index", ".menu-hero:not(.cat-hero) h1", ".menu-hero:not(.cat-hero) .sec-sub"
    ].join(",");
    translateEls(document.querySelectorAll(commonSel), lang);

    // footer telif satırı (yıl span'ı hariç, sadece son metin düğümü)
    translateTrailingText(document.querySelectorAll(".footer-bottom p:first-child"), lang);

    // aria-label / attribute çevirileri
    translateAttr(".nav-toggle", "aria-label", lang);
    translateAttr(".back-to-top", "aria-label", lang);
    translateAttr(".mi-dlg-x", "aria-label", lang);
    translateAttr("nav.mobile-bar", "aria-label", lang);
    translateAttr("#main-nav", "aria-label", lang);
    translateAttr(".cat-prevnext", "aria-label", lang);

    // dil düğmelerinin görünümü
    document.querySelectorAll(".lang-btn").forEach(function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-lang") === lang);
      b.setAttribute("aria-pressed", b.getAttribute("data-lang") === lang ? "true" : "false");
    });

    // kategori/ürün içeriğini (menu-render.js) yeniden çizmesi için haber ver
    document.dispatchEvent(new CustomEvent("limos:langchange", { detail: { lang: lang } }));
  }

  /* ---------- Dil değiştirici arayüzü ---------- */
  function buildSwitcher(extraClass) {
    var wrap = document.createElement("div");
    wrap.className = "lang-switch" + (extraClass ? " " + extraClass : "");
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", "Dil seçimi / Language");
    LANGS.forEach(function (code) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "lang-btn";
      b.setAttribute("data-lang", code);
      b.setAttribute("aria-pressed", "false");
      b.title = LANG_NAME[code];
      b.textContent = LANG_LABEL[code];
      b.addEventListener("click", function () {
        setLang(code);
        applyLang(code);
      });
      wrap.appendChild(b);
    });
    return wrap;
  }

  function mountSwitchers() {
    var actions = document.querySelector(".header-actions");
    if (actions && !actions.querySelector(".lang-switch")) {
      actions.insertBefore(buildSwitcher(), actions.firstChild);
    }
    // Mobilde: dil seçici hamburger menüsünün içinde değil, üst bar'da (nav-toggle'ın yanında)
    var headerInner = document.querySelector(".header-inner");
    var toggle = document.getElementById("nav-toggle");
    if (headerInner && toggle && !headerInner.querySelector(".lang-switch--topbar")) {
      headerInner.insertBefore(buildSwitcher("lang-switch--topbar"), toggle);
    }
  }

  /* ---------- İlk ziyaret: dil seçim ekranı ---------- */
  function hasSavedLang() {
    try { return !!localStorage.getItem(STORAGE_KEY); } catch (e) { return true; }
  }

  function closeLangGate() {
    var g = document.getElementById("lang-gate");
    if (g && g.parentNode) g.parentNode.removeChild(g);
    document.documentElement.classList.remove("lang-gate-open");
    document.removeEventListener("keydown", onLangGateKeydown);
  }
  function onLangGateKeydown(e) {
    if (e.key === "Escape") { setLang("tr"); closeLangGate(); }
  }

  function showLangGate() {
    var overlay = document.createElement("div");
    overlay.className = "lang-gate";
    overlay.id = "lang-gate";

    var backdrop = document.createElement("div");
    backdrop.className = "lang-gate-backdrop";
    overlay.appendChild(backdrop);

    var box = document.createElement("div");
    box.className = "lang-gate-box";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-labelledby", "lang-gate-title");

    var title = document.createElement("p");
    title.className = "lang-gate-title";
    title.id = "lang-gate-title";
    title.innerHTML = "Dilinizi seçin<br>Choose your language<br>اختر لغتك<br>Sprache wählen";
    box.appendChild(title);

    var grid = document.createElement("div");
    grid.className = "lang-gate-grid";
    LANGS.forEach(function (code) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "lang-gate-btn";
      b.setAttribute("data-lang", code);
      b.textContent = LANG_NAME[code];
      b.addEventListener("click", function () {
        setLang(code);
        applyLang(code);
        closeLangGate();
      });
      grid.appendChild(b);
    });
    box.appendChild(grid);

    var skip = document.createElement("button");
    skip.type = "button";
    skip.className = "lang-gate-skip";
    skip.textContent = "Türkçe ile devam et";
    skip.addEventListener("click", function () { setLang("tr"); closeLangGate(); });
    box.appendChild(skip);

    overlay.appendChild(box);
    document.body.appendChild(overlay);
    document.documentElement.classList.add("lang-gate-open");
    document.addEventListener("keydown", onLangGateKeydown);

    window.setTimeout(function () {
      var first = grid.querySelector(".lang-gate-btn");
      if (first) first.focus();
    }, 50);
  }

  window.LimosI18n = { getLang: getLang, applyLang: applyLang };

  document.addEventListener("DOMContentLoaded", function () {
    // Dil özelliği yalnızca menü sayfalarında (menu.html + menu-<slug>.html) etkin
    if (!document.body.classList.contains("menu-page")) return;
    mountSwitchers();
    applyLang(getLang());
    if (!hasSavedLang()) showLangGate();
  });
})();

/* =========================================================
   Limos Kahvaltı — Menü içeriğini /api/menu'den anlık render eder
   (menu.html: kategori kartları / menu-<slug>.html: ürün listesi)
   ========================================================= */
(function () {
  "use strict";

  var LABELS = {
    menuWord: { tr: "Menü", en: "Menu", de: "Speisekarte", ar: "القائمة" },
    prev: { tr: "← Önceki", en: "← Previous", de: "← Zurück", ar: "→ السابق" },
    next: { tr: "Sonraki →", en: "Next →", de: "Weiter →", ar: "التالي ←" }
  };
  var ARABIC_DIGITS = { "0": "٠", "1": "١", "2": "٢", "3": "٣", "4": "٤", "5": "٥", "6": "٦", "7": "٧", "8": "٨", "9": "٩" };

  function toDigits(str, lang) {
    if (lang !== "ar") return str;
    return String(str).replace(/[0-9]/g, function (d) { return ARABIC_DIGITS[d]; });
  }
  function pad2(n) { return n < 10 ? "0" + n : String(n); }
  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function lang() { return (window.LimosI18n && window.LimosI18n.getLang()) || "tr"; }

  var DATA = null;

  function renderCatList() {
    var container = document.getElementById("cat-list");
    if (!container || !DATA) return;
    var l = lang();
    var html = "";
    DATA.categories.forEach(function (c) {
      html +=
        '<a class="cat-card" href="menu-' + c.slug + '.html">' +
          '<span class="cat-thumb"><img src="' + escapeHtml(c.image) + '" width="800" height="800" loading="lazy" decoding="async" alt="" /></span>' +
          '<span class="cat-name">' + escapeHtml(c.name[l]) + '<span class="cat-desc">' + escapeHtml(c.listDesc[l]) + '</span></span>' +
          '<svg class="cat-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
        '</a>';
    });
    container.innerHTML = html;
  }

  function renderCatPage() {
    var slug = document.body.getAttribute("data-category");
    if (!slug || !DATA) return;
    var l = lang();
    var cats = DATA.categories;
    var idx = -1;
    for (var i = 0; i < cats.length; i++) { if (cats[i].slug === slug) { idx = i; break; } }
    if (idx === -1) return;
    var cat = cats[idx];
    var total = cats.length;

    var bc = document.getElementById("cat-breadcrumb");
    if (bc) bc.textContent = LABELS.menuWord[l] + " · " + toDigits(pad2(idx + 1), l) + " / " + toDigits(String(total), l);

    var h1 = document.getElementById("cat-baslik");
    if (h1) h1.textContent = cat.name[l];

    var blurb = document.getElementById("cat-blurb");
    if (blurb) blurb.textContent = cat.blurb[l];

    var side = document.getElementById("cat-side-links");
    if (side) {
      var sideHtml = "";
      cats.forEach(function (c) {
        var cur = c.slug === slug;
        sideHtml += '<a href="menu-' + c.slug + '.html"' + (cur ? ' class="is-current" aria-current="page"' : "") + '>' + escapeHtml(c.name[l]) + '</a>';
      });
      side.innerHTML = sideHtml;
    }

    var list = document.getElementById("mi-list");
    if (list) {
      var items = DATA.items
        .filter(function (it) { return it.categorySlug === slug; })
        .sort(function (a, b) { return a.order - b.order; });
      var itemsHtml = "";
      items.forEach(function (it) {
        itemsHtml +=
          '<li><button class="mi" type="button" ' +
            'data-name="' + escapeHtml(it.name[l]) + '" ' +
            'data-price="' + escapeHtml(it.price || "") + '" ' +
            'data-cat="' + escapeHtml(cat.name[l]) + '" ' +
            'data-img="' + escapeHtml(it.img || "") + '" ' +
            'data-desc="' + escapeHtml(it.desc[l] || "") + '">' +
            '<img class="mi-thumb" src="' + escapeHtml(it.imgThumb || it.img || "") + '" width="80" height="80" loading="lazy" decoding="async" alt="" />' +
            '<span class="mi-name">' + escapeHtml(it.name[l]) + '</span><span class="p">' + escapeHtml(it.price || "") + '</span>' +
          '</button></li>';
      });
      list.innerHTML = itemsHtml;
    }

    var nav = document.getElementById("cat-prevnext");
    if (nav) {
      var navHtml = "";
      if (idx > 0) {
        var prevCat = cats[idx - 1];
        navHtml += '<a href="menu-' + prevCat.slug + '.html"><span>' + LABELS.prev[l] + '</span><b>' + escapeHtml(prevCat.name[l]) + '</b></a>';
      }
      if (idx < total - 1) {
        var nextCat = cats[idx + 1];
        navHtml += '<a href="menu-' + nextCat.slug + '.html" class="cat-next"><span>' + LABELS.next[l] + '</span><b>' + escapeHtml(nextCat.name[l]) + '</b></a>';
      }
      nav.innerHTML = navHtml;
    }
  }

  function renderAll() {
    renderCatList();
    renderCatPage();
    if (window.LimosWireMenuItems) window.LimosWireMenuItems();
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!document.body.classList.contains("menu-page")) return;

    fetch("/api/menu")
      .then(function (r) { return r.json(); })
      .then(function (data) {
        DATA = data;
        renderAll();
      })
      .catch(function (err) { console.error("Menü yüklenemedi:", err); });

    document.addEventListener("limos:langchange", function () {
      if (DATA) renderAll();
    });
  });
})();

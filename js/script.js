/* =========================================================
   Limos Kahvaltı — Vanilla JS etkileşimleri
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 0. Giriş animasyonu (dönen limon, ~4 sn) ---------- */
  (function introSplash() {
    var s = document.getElementById("intro-splash");
    if (!s) return;
    var seen;
    try { seen = sessionStorage.getItem("limosIntro"); } catch (e) {}
    if (reduceMotion || seen) {
      if (s.parentNode) s.parentNode.removeChild(s);
      return;
    }
    document.documentElement.classList.add("intro-lock");

    var word = document.getElementById("intro-splash-word");
    var dotCount = 1;
    var dotsTimer = word ? window.setInterval(function () {
      dotCount = (dotCount % 3) + 1;
      word.textContent = "Yükleniyor" + ".".repeat(dotCount);
    }, 500) : null;

    window.setTimeout(function () {
      s.classList.add("is-hiding");
      document.documentElement.classList.remove("intro-lock");
      if (dotsTimer) window.clearInterval(dotsTimer);
      try { sessionStorage.setItem("limosIntro", "1"); } catch (e) {}
      window.setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, 850);
    }, 4000);
  })();

  document.addEventListener("DOMContentLoaded", function () {

    /* ---------- 1. Mobil navigasyon ---------- */
    var toggle = document.getElementById("nav-toggle");
    var nav = document.getElementById("main-nav");

    if (toggle && nav) {
      var closeNav = function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.documentElement.classList.remove("nav-open");
      };

      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        document.documentElement.classList.toggle("nav-open", open);
      });

      nav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", closeNav);
      });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeNav();
      });

      window.addEventListener("resize", function () {
        if (window.innerWidth > 900) closeNav();
      });
    }

    /* ---------- 2. Header scroll durumu ---------- */
    var header = document.querySelector("[data-header]");
    if (header) {
      var onHeaderScroll = function () {
        header.classList.toggle("is-scrolled", window.scrollY > 40);
      };
      window.addEventListener("scroll", onHeaderScroll, { passive: true });
      onHeaderScroll();
    }

    /* ---------- 3. Menü kategori filtreleme ---------- */
    var filterButtons = document.querySelectorAll(".filter-btn");
    var categories = document.querySelectorAll(".menu-cat");

    var applyFilter = function (filter) {
      filterButtons.forEach(function (b) {
        b.classList.toggle("is-active", b.getAttribute("data-filter") === filter);
      });
      categories.forEach(function (cat) {
        var match = filter === "all" || cat.getAttribute("data-cat") === filter;
        cat.classList.toggle("is-hidden", !match);
      });
    };

    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyFilter(btn.getAttribute("data-filter"));
      });
    });

    if (filterButtons.length) {
      var initial = document.querySelector(".filter-btn.is-active") || filterButtons[0];
      applyFilter(initial.getAttribute("data-filter"));
    }

    /* ---------- 4. Aktif menü linkini vurgula (scroll spy) ---------- */
    var sections = document.querySelectorAll("main section[id]");
    var navLinks = document.querySelectorAll(".main-nav .nav-link");

    if ("IntersectionObserver" in window && sections.length) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute("id");
            navLinks.forEach(function (link) {
              link.classList.toggle("is-current", link.getAttribute("href") === "#" + id);
            });
          }
        });
      }, { rootMargin: "-45% 0px -50% 0px" });

      sections.forEach(function (s) { spy.observe(s); });
    }

    /* ---------- 5. Scroll reveal ---------- */
    var revealEls = document.querySelectorAll("[data-reveal]");
    if (revealEls.length) {
      if (reduceMotion || !("IntersectionObserver" in window)) {
        revealEls.forEach(function (el) { el.classList.add("is-visible"); });
      } else {
        var revealObs = new IntersectionObserver(function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              obs.unobserve(entry.target);
            }
          });
        }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });
        revealEls.forEach(function (el) { revealObs.observe(el); });
      }
    }

    /* ---------- 6. Yukarı çık butonu ---------- */
    var toTop = document.getElementById("back-to-top");
    if (toTop) {
      var onScroll = function () {
        toTop.classList.toggle("is-visible", window.scrollY > 800);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    /* ---------- 7. Footer yıl ---------- */
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- 8. Yorum şeridi: kusursuz döngü için içeriği kopyala ---------- */
    var reviewsTrack = document.getElementById("reviews-track");
    if (reviewsTrack && !reduceMotion) {
      var cards = Array.prototype.slice.call(reviewsTrack.children);
      cards.forEach(function (card) {
        var clone = card.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        reviewsTrack.appendChild(clone);
      });
    }

    /* ---------- 9. Görsel yüklenemezse yer tutucuya düş ---------- */
    document.querySelectorAll("img[data-fallback]").forEach(function (img) {
      var swap = function () {
        var fb = img.getAttribute("data-fallback");
        if (fb && img.getAttribute("src") !== fb) img.setAttribute("src", fb);
      };
      img.addEventListener("error", swap, { once: true });
      if (img.complete && img.naturalWidth === 0) swap();
    });

    /* ---------- 10. LocalBusiness / Restaurant yapılandırılmış veri ---------- */
    try {
      var schema = {
        "@context": "https://schema.org",
        "@type": "Restaurant",
        "name": "Limos Kahvaltı",
        "description": "Beşiktaş Sinanpaşa'da serpme ve à la carte kahvaltı: menemenler, sıcak pişiler, gözlemeler, mıhlama ve taze kahve.",
        "servesCuisine": "Turkish breakfast",
        "priceRange": "₺₺₺",
        "image": ["images/hero.webp", "logo.webp"],
        "telephone": "+902122369236",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Sinanpaşa, Çelebi Oğlu Sk. No:11",
          "addressLocality": "Beşiktaş",
          "addressRegion": "İstanbul",
          "postalCode": "34353",
          "addressCountry": "TR"
        },
        "hasMap": "https://www.google.com/maps/search/?api=1&query=Limos+Kahvalt%C4%B1+Be%C5%9Fikta%C5%9F",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.6",
          "reviewCount": "2418"
        },
        "sameAs": ["https://instagram.com/limoskahvalti"]
      };
      var s = document.createElement("script");
      s.type = "application/ld+json";
      s.textContent = JSON.stringify(schema);
      document.head.appendChild(s);
    } catch (e) { /* yok say */ }

    /* ---------- 11. Loop video: bazı tarayıcılar loop/autoplay'i takmıyor ---------- */
    document.querySelectorAll("video[loop], video[autoplay]").forEach(function (v) {
      v.muted = true;               // autoplay politikası için şart
      v.setAttribute("muted", "");
      v.playsInline = true;
      v.loop = true;

      var kick = function () {
        var p = v.play();
        if (p && typeof p.catch === "function") p.catch(function () {});
      };
      // döngü kopması / erken durma durumunda başa sar
      v.addEventListener("ended", function () { v.currentTime = 0; kick(); });
      v.addEventListener("pause", function () {
        if (!v.ended && !document.hidden && v.__inView) kick();
      });

      if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            v.__inView = e.isIntersecting;
            if (e.isIntersecting) kick();
            else v.pause();
          });
        }, { threshold: 0.1 });
        io.observe(v);
      } else {
        v.__inView = true;
        kick();
      }
      document.addEventListener("visibilitychange", function () {
        if (!document.hidden && v.__inView) kick();
      });
    });

    /* ---------- 12. Menü: ürün pop-up ---------- */
    /* .mi butonları artık menu-render.js tarafından DB'den dinamik oluşturuluyor;
       bu yüzden dialog kurulumu (statik elemanlar) bir kez yapılır, buton
       dinleyicileri ise her render sonrası wireMenuItems() ile yeniden bağlanır. */
    var miDlg = document.getElementById("mi-dlg");
    if (miDlg) {
      var miImg = document.getElementById("mi-dlg-img");
      var miCat = document.getElementById("mi-dlg-cat");
      var miTitle = document.getElementById("mi-dlg-title");
      var miPrice = document.getElementById("mi-dlg-price");
      var miDesc = document.getElementById("mi-dlg-desc");
      var miLast = null;

      var miClose = function () {
        miDlg.hidden = true;
        document.documentElement.classList.remove("mi-dlg-open");
        if (miLast && miLast.focus) miLast.focus();
      };
      var miOpen = function (btn) {
        miLast = btn;
        var img = btn.getAttribute("data-img") || "";
        var name = btn.getAttribute("data-name") || "";
        miImg.src = img;
        miImg.alt = name;
        miCat.textContent = btn.getAttribute("data-cat") || "";
        miTitle.textContent = name;
        miPrice.textContent = btn.getAttribute("data-price") || "";
        miDesc.textContent = btn.getAttribute("data-desc") || "";
        miDlg.hidden = false;
        document.documentElement.classList.add("mi-dlg-open");
        var x = miDlg.querySelector(".mi-dlg-x");
        if (x && x.focus) x.focus();
      };

      window.LimosWireMenuItems = function () {
        document.querySelectorAll(".mi").forEach(function (btn) {
          btn.addEventListener("click", function () { miOpen(btn); });
        });
      };
      window.LimosWireMenuItems();

      Array.prototype.forEach.call(miDlg.querySelectorAll("[data-close]"), function (el) {
        el.addEventListener("click", miClose);
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && !miDlg.hidden) miClose();
      });
    }
  });
})();

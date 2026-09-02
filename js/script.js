/* =========================================================
   Limos Kahvaltı — Vanilla JS etkileşimleri
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("DOMContentLoaded", function () {

    /* ---------- 1. Mobil navigasyon ---------- */
    var toggle = document.getElementById("nav-toggle");
    var nav = document.getElementById("main-nav");

    if (toggle && nav) {
      var closeNav = function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      };

      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
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
        "sameAs": ["https://instagram.com/limosbesiktas"]
      };
      var s = document.createElement("script");
      s.type = "application/ld+json";
      s.textContent = JSON.stringify(schema);
      document.head.appendChild(s);
    } catch (e) { /* yok say */ }
  });
})();

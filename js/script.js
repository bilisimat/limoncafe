/* =========================================================
   Limos Kahvaltı — Vanilla JS etkileşimleri
   ========================================================= */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {

    /* ---------- 1. Mobil navigasyon ---------- */
    const toggle = document.getElementById("nav-toggle");
    const nav = document.getElementById("main-nav");

    if (toggle && nav) {
      const closeNav = function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      };

      toggle.addEventListener("click", function () {
        const open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });

      // Menüden bir linke tıklanınca kapat
      nav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", closeNav);
      });

      // ESC ile kapat
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeNav();
      });

      // Masaüstüne geçince sıfırla
      window.addEventListener("resize", function () {
        if (window.innerWidth > 860) closeNav();
      });
    }

    /* ---------- 2. Menü kategori filtreleme ---------- */
    const filterButtons = document.querySelectorAll(".filter-btn");
    const categories = document.querySelectorAll(".menu-cat");

    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const filter = btn.getAttribute("data-filter");

        filterButtons.forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");

        categories.forEach(function (cat) {
          const match = filter === "all" || cat.getAttribute("data-cat") === filter;
          cat.classList.toggle("is-hidden", !match);
        });
      });
    });

    /* ---------- 3. Aktif menü linkini vurgula (scroll spy) ---------- */
    const sections = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll(".main-nav .nav-link");

    if ("IntersectionObserver" in window && sections.length) {
      const spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach(function (link) {
              link.classList.toggle(
                "is-current",
                link.getAttribute("href") === "#" + id
              );
            });
          }
        });
      }, { rootMargin: "-45% 0px -50% 0px" });

      sections.forEach(function (s) { spy.observe(s); });
    }

    /* ---------- 4. Yukarı çık butonu ---------- */
    const toTop = document.getElementById("back-to-top");
    if (toTop) {
      const onScroll = function () {
        toTop.classList.toggle("is-visible", window.scrollY > 600);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    /* ---------- 5. Footer yıl ---------- */
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- 6b. Yorum şeridi: kusursuz döngü için içeriği kopyala ---------- */
    const reviewsTrack = document.getElementById("reviews-track");
    if (reviewsTrack) {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduceMotion) {
        const cards = Array.prototype.slice.call(reviewsTrack.children);
        cards.forEach(function (card) {
          const clone = card.cloneNode(true);
          clone.setAttribute("aria-hidden", "true");
          reviewsTrack.appendChild(clone);
        });
      }
    }

    /* ---------- 6. Görsel yüklenemezse yer tutucuya düş ----------
       (Inline onerror handler'ları CSP uyumu için buraya taşındı) */
    document.querySelectorAll("img[data-fallback]").forEach(function (img) {
      const swap = function () {
        const fb = img.getAttribute("data-fallback");
        if (fb && img.getAttribute("src") !== fb) img.setAttribute("src", fb);
      };
      img.addEventListener("error", swap, { once: true });
      // defer script çalışmadan önce hata almış olabilecek görselleri de yakala
      if (img.complete && img.naturalWidth === 0) swap();
    });
  });
})();

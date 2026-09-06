/* =========================================================
   Limos Kahvaltı — Vanilla JS etkileşimleri
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 0. Giriş animasyonu (dönen limon) ----------
     Sabit bir süre beklemek yerine sayfanın gerçekten yüklenmesini
     (window "load" — görseller dahil) bekler; böylece ana içerik hazır
     olmadan splash ekranı geçip boş/yarım bir sayfa göstermez. Yine de
     çok hızlı bağlantılarda animasyonun görülebilmesi için asgari bir
     süre, çok yavaş bağlantılarda da sonsuza kadar takılı kalmaması için
     bir üst sınır uygulanır. */
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

    // Logo videosunun (~4.25sn) kesilmeden oynaması için asgari süre onun
    // uzunluğuna göre ayarlanır; MAX_MS yalnızca çok yavaş bağlantılar için
    // üst sınır güvencesidir.
    var MIN_MS = 4300;
    var MAX_MS = 6500;
    var start = Date.now();
    var hidden = false;

    function hide() {
      if (hidden) return;
      hidden = true;
      s.classList.add("is-hiding");
      document.documentElement.classList.remove("intro-lock");
      try { sessionStorage.setItem("limosIntro", "1"); } catch (e) {}
      window.setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, 850);
    }

    function readyToHide() {
      var elapsed = Date.now() - start;
      if (elapsed >= MIN_MS) hide();
      else window.setTimeout(hide, MIN_MS - elapsed);
    }

    if (document.readyState === "complete") {
      readyToHide();
    } else {
      window.addEventListener("load", readyToHide, { once: true });
    }
    window.setTimeout(hide, MAX_MS);
  })();

  document.addEventListener("DOMContentLoaded", function () {

    /* ---------- 1. Mobil navigasyon ---------- */
    var toggle = document.getElementById("nav-toggle");
    var nav = document.getElementById("main-nav");

    if (toggle && nav) {
      var closeNav = function (returnFocus) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.documentElement.classList.remove("nav-open");
        if (returnFocus) toggle.focus();
      };

      var openNav = function () {
        nav.classList.add("is-open");
        toggle.setAttribute("aria-expanded", "true");
        document.documentElement.classList.add("nav-open");
        // Odağı çekmecenin içine taşı — klavye/ekran okuyucu kullanıcıları
        // arkadaki gizli sayfa içeriğinde kalmasın.
        var firstLink = nav.querySelector("a");
        if (firstLink) firstLink.focus();
      };

      toggle.addEventListener("click", function () {
        if (nav.classList.contains("is-open")) closeNav(); else openNav();
      });

      nav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () { closeNav(); });
      });

      // Dışarı (karartılmış alana) tıklayınca da kapansın.
      document.addEventListener("click", function (e) {
        if (!nav.classList.contains("is-open")) return;
        if (nav.contains(e.target) || toggle.contains(e.target)) return;
        closeNav();
      });

      document.addEventListener("keydown", function (e) {
        if (!nav.classList.contains("is-open")) return;
        if (e.key === "Escape") {
          closeNav(true);
          return;
        }
        // Basit odak tuzağı: çekmece açıkken Tab, içindeki son/ilk
        // odaklanabilir öğede arkadaki sayfaya kaçmasın, çekmecede döngü yapsın.
        if (e.key === "Tab") {
          var focusables = Array.prototype.slice.call(
            nav.querySelectorAll("a[href], button:not([disabled])")
          );
          if (!focusables.length) return;
          var first = focusables[0];
          var last = focusables[focusables.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
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
      toTop.addEventListener("click", function (e) {
        e.preventDefault();
        // html { scroll-behavior: smooth } zaten tanımlı, bu yüzden düz
        // scrollTo(0, 0) yeterli — ayrıca behavior seçeneği vermeye gerek yok.
        window.scrollTo(0, 0);
      });
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

/* Menü kategori sayfalarını üretir: menu-<slug>.html  (8 adet)
   Çalıştır:  node _scripts/gen-menu-pages.mjs
   Kaynak: aşağıdaki CATS dizisi. menu.html'deki içeriklerle birebir. */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(".");
const CSS_V = "v=32";
const JS_V = "v=10";

const CATS = [
  {
    slug: "menemenler", name: "Menemenler",
    items: [
      ["Klasik Menemen", "220₺"], ["Kaşarlı Menemen", "250₺"], ["Beyaz Peynirli Menemen", "250₺"],
      ["Karışık Menemen", "350₺"], ["Kavurmalı Menemen", "370₺"], ["Sucuklu Menemen", "330₺"],
    ],
  },
  {
    slug: "yumurta", name: "Sahanda Yumurtalar / Omletler",
    items: [
      ["Sade Yumurta", "150₺"], ["Kaşarlı Yumurta", "200₺"], ["Beyaz Peynirli Yumurta", "200₺"],
      ["Karışık Yumurta", "250₺"], ["Kavurmalı Yumurta", "350₺"], ["Sucuklu Yumurta", "270₺"],
      ["Patatesli Yumurta", "200₺"], ["Mantar Kaşar Yumurta", "250₺"],
    ],
  },
  {
    slug: "tavalar", name: "Tavalar",
    items: [
      ["Mıhlama", "300₺"], ["Sucuk Tava", "300₺"], ["Hellim Tava", "200₺"], ["Kavurma Tava", "350₺"],
      ["Yumurtalı Ekmek (6)", "150₺"], ["Sosis Tava", "250₺"], ["Salçalı Sosis", "300₺"],
      ["Patates Tava", "180₺"], ["Sigara Böreği (6)", "120₺"],
    ],
  },
  {
    slug: "pisiler", name: "Pişiler", nameSmall: "(4 Adet)",
    items: [
      ["Sade Pişi", "200₺"], ["Kaşarlı Pişi", "250₺"], ["Beyaz Peynirli Pişi", "250₺"],
      ["Nutellalı Pişi", "250₺"], ["Kavurma Kaşar Pişi", "350₺"],
    ],
  },
  {
    slug: "gozlemeler", name: "Gözlemeler",
    items: [
      ["Kaşarlı Gözleme", "275₺"], ["Beyaz Peynirli Gözleme", "275₺"], ["Patatesli Gözleme", "275₺"],
      ["Patates Kaşarlı Gözleme", "300₺"], ["Kavurma Kaşarlı Gözleme", "400₺"],
      ["Sucuklu Gözleme", "350₺"], ["Sucuklu Kaşarlı Gözleme", "375₺"],
    ],
  },
  {
    slug: "krep", name: "Krep & Pankek Çeşitleri",
    items: [["Sade Krep", "150₺"], ["Nutellalı Krep", "275₺"], ["Pankek (4 Adet)", "400₺"]],
    note: "Nutella ve meyve ile servis edilir.",
  },
  {
    slug: "ekstralar", name: "Ekstralar",
    items: [
      ["Beyaz Peynir (1 Dilim)", "75₺"], ["Kaşar Peyniri (1 Dilim)", "75₺"], ["Çeçil Peyniri", "95₺"],
      ["Karışık Peynir Tabağı", "220₺"], ["Tereyağı", "120₺"], ["Zeytin Tabağı", "120₺"],
      ["Tahin Pekmez", "200₺"], ["Söğüş", "150₺"], ["Acuka", "120₺"], ["Haşlanmış Yumurta", "40₺"],
      ["Bal Kaymak", "220₺"], ["Nutella", "150₺"], ["Reçel", "100₺"], ["Simit", "45₺"], ["Yeşillik", "120₺"],
    ],
  },
  {
    slug: "icecekler", name: "İçecekler",
    subcols: [
      ["Soğuk İçecekler", [
        ["Su", "25₺"], ["Sade Soda", "50₺"], ["Meyveli Soda", "60₺"], ["Kola", "90₺"], ["Meyve Suyu", "75₺"],
        ["Ice Tea", "75₺"], ["Taze Sıkma Portakal Suyu", "175₺"], ["Ayran", "50₺"], ["Naneli Limonata", "150₺"],
      ]],
      ["Sıcak İçecekler", [
        ["Çay", "40₺"], ["Türk Kahvesi", "100₺"], ["Demleme Bitki Çayı", "100₺"], ["Espresso", "85₺"],
        ["Americano", "100₺"], ["Latte", "120₺"], ["Cappuccino", "120₺"], ["Mocha", "120₺"], ["Filtre Kahve", "100₺"],
      ]],
    ],
  },
];

const esc = (s) => s.replace(/&/g, "&amp;");
const li = ([n, p]) => `                <li><span>${esc(n)}</span><span class="dots"></span><span class="p">${p}</span></li>`;
const list = (items) => `              <ul class="menu-list">\n${items.map(li).join("\n")}\n              </ul>`;

function chrome() {
  return {
    head: (title, desc) => `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#211C18" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; frame-src https://www.google.com; connect-src 'self'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests" />
  <meta name="referrer" content="strict-origin-when-cross-origin" />
  <title>${title} — Limos Kahvaltı Menüsü</title>
  <meta name="description" content="${desc}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400;1,500&family=Inter:wght@400;500&display=swap" rel="stylesheet" />
  <link rel="icon" type="image/webp" href="logo.webp" />
  <link rel="stylesheet" href="css/styles.css?${CSS_V}" />
</head>
<body class="menu-page cat-page">

  <a class="skip-link" href="#cat-baslik">İçeriğe geç</a>

  <header class="site-header" id="top" data-header>
    <div class="container header-inner">
      <a href="index.html" class="header-logo" aria-label="Limos Kahvaltı — ana sayfa">
        <img src="images/logo-mark.jpg" width="150" height="150" alt="Limos Kahvaltı" />
      </a>
      <nav class="main-nav" id="main-nav" aria-label="Ana menü">
        <a href="index.html#kahvalti" class="nav-link">Kahvaltı</a>
        <a href="menu.html" class="nav-link is-current">Menü</a>
        <a href="index.html#galeri" class="nav-link">Galeri</a>
        <a href="index.html#iletisim" class="nav-link">İletişim</a>
        <a href="tel:+905494980021" class="nav-link nav-link--cta">Rezervasyon &amp; Bilgi</a>
      </nav>
      <a href="index.html" class="brand" aria-label="Limos Kahvaltı — ana sayfa">
        <span class="brand-word">Limos</span>
        <span class="brand-sub">kahvaltı — beşiktaş</span>
      </a>
      <div class="header-actions">
        <a href="https://www.google.com/maps/search/?api=1&amp;query=Limos+Kahvalt%C4%B1+%C3%87elebi+O%C4%9Flu+Sk.+No%3A11+Be%C5%9Fikta%C5%9F" target="_blank" rel="noopener noreferrer" class="header-phone">Yol Tarifi</a>
        <a href="tel:+902122369236" class="btn btn-line header-cta">Bizi Arayın</a>
      </div>
      <button class="nav-toggle" id="nav-toggle" aria-label="Menüyü aç / kapat" aria-expanded="false" aria-controls="main-nav">
        <span></span><span></span>
      </button>
    </div>
  </header>`,
    foot: `  <footer class="site-footer">
    <div class="container">
      <p class="footer-cta">Masada görüşürüz.</p>
      <div class="footer-inner">
        <div class="footer-brand">
          <img class="footer-logo" src="images/logo-mark.jpg" width="150" height="150" alt="Limos Kahvaltı" />
          <p>Beşiktaş Sinanpaşa'da, kahvaltı sokağında. Serpme ve à la carte kahvaltı, taze pişiler ve demli çay.</p>
        </div>
        <nav class="footer-col" aria-label="Alt menü">
          <h4>Keşfet</h4>
          <a href="index.html#kahvalti">Kahvaltı</a>
          <a href="menu.html">Menü</a>
          <a href="index.html#galeri">Galeri</a>
          <a href="index.html#yorumlar">Yorumlar</a>
          <a href="index.html#iletisim">İletişim</a>
        </nav>
        <div class="footer-col">
          <h4>İletişim</h4>
          <p>Sinanpaşa, Çelebi Oğlu Sk. No:11<br />34353 Beşiktaş / İstanbul</p>
          <p><a href="tel:+902122369236">0 (212) 236 92 36</a></p>
          <p><a href="tel:+905494980021">0549 498 00 21</a></p>
          <p><a href="https://instagram.com/limosbesiktas" target="_blank" rel="noopener noreferrer">Instagram — @limosbesiktas</a></p>
          <p>Her gün · 18:00'de kapanır</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; <span id="year"></span> Limos Kahvaltı. Tüm hakları saklıdır.</p>
        <p><a href="https://www.google.com/maps/search/?api=1&amp;query=Limos+Kahvalt%C4%B1+Be%C5%9Fikta%C5%9F" target="_blank" rel="noopener noreferrer">Google Haritalar'da aç</a></p>
      </div>
    </div>
  </footer>

  <a href="#top" class="back-to-top" id="back-to-top" aria-label="Yukarı çık">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
  </a>

  <nav class="mobile-bar" aria-label="Hızlı erişim">
    <a href="tel:+905494980021" class="mobile-bar-btn">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
      <span>Ara</span>
    </a>
    <a href="https://www.google.com/maps/search/?api=1&amp;query=Limos+Kahvalt%C4%B1+%C3%87elebi+O%C4%9Flu+Sk.+No%3A11+Be%C5%9Fikta%C5%9F" target="_blank" rel="noopener noreferrer" class="mobile-bar-btn">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
      <span>Konum</span>
    </a>
    <a href="https://instagram.com/limosbesiktas" target="_blank" rel="noopener noreferrer" class="mobile-bar-btn">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
      <span>Instagram</span>
    </a>
  </nav>

  <script src="js/script.js?${JS_V}" defer></script>
</body>
</html>
`,
  };
}

const C = chrome();

CATS.forEach((cat, i) => {
  const num = String(i + 1).padStart(2, "0");
  const prev = CATS[(i - 1 + CATS.length) % CATS.length];
  const next = CATS[(i + 1) % CATS.length];

  const side = CATS.map((c) =>
    `          <a href="menu-${c.slug}.html"${c.slug === cat.slug ? ' aria-current="page" class="is-current"' : ""}>${esc(c.name)}</a>`
  ).join("\n");

  let mainInner;
  if (cat.subcols) {
    mainInner =
      `            <div class="menu-subcols">\n` +
      cat.subcols.map(([t, items]) =>
        `              <div class="menu-subcol">\n                <h4 class="menu-subtitle">${esc(t)}</h4>\n${list(items).replace(/^ {14}/gm, "                ")}\n              </div>`
      ).join("\n") +
      `\n            </div>`;
  } else {
    mainInner = list(cat.items).replace(/^ {14}/gm, "            ");
    if (cat.note) mainInner += `\n            <p class="menu-cat-note">${esc(cat.note)}</p>`;
  }

  const html = `${C.head(cat.name.replace(" / ", " ve "), `Limos Kahvaltı ${cat.name} kategorisi ve fiyatları.`)}

  <main>
    <section class="menu-hero cat-hero">
      <div class="container">
        <a class="cat-back" href="menu.html">← Tüm menü</a>
        <p class="sec-index sec-index--light">Menü · ${num} / 08</p>
        <h1 class="display display--light" id="cat-baslik">${esc(cat.name)}${cat.nameSmall ? ` <small>${cat.nameSmall}</small>` : ""}</h1>
      </div>
    </section>

    <section class="section cat-sec">
      <div class="container">
        <div class="cat-layout">
          <aside class="cat-side" aria-label="Kategoriler">
            <p class="cat-side-label">Kategoriler</p>
${side}
          </aside>

          <div class="cat-main">
${mainInner}

            <nav class="cat-prevnext" aria-label="Kategoriler arası gezinme">
              <a href="menu-${prev.slug}.html"><span>← Önceki</span><b>${esc(prev.name)}</b></a>
              <a href="menu-${next.slug}.html" class="cat-next"><span>Sonraki →</span><b>${esc(next.name)}</b></a>
            </nav>
          </div>
        </div>
      </div>
    </section>
  </main>

${C.foot}`;

  const file = path.join(ROOT, `menu-${cat.slug}.html`);
  fs.writeFileSync(file, html, "utf8");
  console.log("yazıldı:", path.basename(file), `(${cat.subcols ? cat.subcols.reduce((n, s) => n + s[1].length, 0) : cat.items.length} satır)`);
});

/* Menü kategori sayfalarını üretir: menu-<slug>.html  (8 adet)
   Çalıştır:  node _scripts/gen-menu-pages.mjs
   Her ürün: [ad, fiyat, açıklama].  Kategori görseli cat.img (thumb + pop-up). */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(".");
const CSS_V = "v=33";
const JS_V = "v=11";

const CATS = [
  {
    slug: "menemenler", name: "Menemenler", img: "images/menemen.webp",
    blurb: "Tereyağında domates-biber, üstüne yumurta; klasikten kavurmalıya.",
    items: [
      ["Klasik Menemen", "220₺", "Domates ve yeşil biberin tereyağında yumuşayıp yumurtayla buluştuğu sade menemen. Sahanda, sıcak servis edilir."],
      ["Kaşarlı Menemen", "250₺", "Klasik menemenin üzerine bol taze kaşar; tavada eriyerek ipek gibi bir kıvam bırakır."],
      ["Beyaz Peynirli Menemen", "250₺", "Ezine beyaz peynirle hazırlanır; hafif tuzlu, ferah bir tat. Yanında ekmekle güzel gider."],
      ["Karışık Menemen", "350₺", "Domates, biber, sucuk, kavurma ve kaşar bir arada. Sofranın en doyurucu menemeni."],
      ["Kavurmalı Menemen", "370₺", "El kavurması eti kendi yağında çevrilip menemene katılır. Yoğun, etli bir lezzet."],
      ["Sucuklu Menemen", "330₺", "Dilimlenmiş sucuk tavada yağını bırakana kadar kızarır, menemenle harmanlanır."],
    ],
  },
  {
    slug: "yumurta", name: "Sahanda Yumurtalar / Omletler", img: "images/sucuklu_yumurta.webp",
    blurb: "Bakır sahanda; sadeden sucuklu, kavurmalı, mantarlı omlete.",
    items: [
      ["Sade Yumurta", "150₺", "İki yumurta bakır sahanda, tereyağında pişirilir. Sarısı akışkan ister misiniz, söyleyin."],
      ["Kaşarlı Yumurta", "200₺", "Sahanda yumurtanın üzerine eriyen taze kaşar. Basit ama tam kıvamında."],
      ["Beyaz Peynirli Yumurta", "200₺", "Ezine beyaz peynir parçalarıyla; tuzlu-ferah bir kahvaltı klasiği."],
      ["Karışık Yumurta", "250₺", "Sucuk, kaşar ve biberle zenginleştirilmiş sahanda yumurta."],
      ["Kavurmalı Yumurta", "350₺", "Kendi yağında çevrilmiş kavurma etinin üzerine kırılan yumurtalar. Doyurucu."],
      ["Sucuklu Yumurta", "270₺", "Bakır sahanda kızaran sucuk dilimleri, üzerine yumurta. Yağı ekmekle silinir."],
      ["Patatesli Yumurta", "200₺", "Küp doğranmış patates altın rengi kızartılır, yumurtayla bağlanır."],
      ["Mantar Kaşar Yumurta", "250₺", "Sotelenmiş mantar ve eriyen kaşarla hazırlanan hafif omlet."],
    ],
  },
  {
    slug: "tavalar", name: "Tavalar", img: "images/sucuk-tava.webp",
    blurb: "Bakır tavada sıcacık: mıhlama, sucuk, kavurma, sigara böreği.",
    items: [
      ["Mıhlama", "300₺", "Karadeniz usulü; tereyağı, mısır unu ve taze peynirle çekilen, telli akan kuymak."],
      ["Sucuk Tava", "300₺", "Dilim sucuk kendi yağında, kenarları çıtır olacak şekilde kızartılır."],
      ["Hellim Tava", "200₺", "Izgara-tava hellim; dışı kızarmış, içi yumuşak. Limon sıkarak servis edilir."],
      ["Kavurma Tava", "350₺", "El kavurması kendi yağında çevrilir; yanında ekmekle."],
      ["Yumurtalı Ekmek (6)", "150₺", "Yumurtaya batırılıp tereyağında kızartılmış 6 dilim ekmek. Çocukların favorisi."],
      ["Sosis Tava", "250₺", "Dana sosis dilimlenip tavada kızartılır."],
      ["Salçalı Sosis", "300₺", "Sosisler domates-biber salçasıyla tavada buluşur; hafif baharatlı."],
      ["Patates Tava", "180₺", "Elde doğranmış patates, bol yağda çıtır çıtır kızartılır."],
      ["Sigara Böreği (6)", "120₺", "Beyaz peynir ve maydanozla sarılıp kızartılmış 6 adet ince börek."],
    ],
  },
  {
    slug: "pisiler", name: "Pişiler", nameSmall: "(4 Adet)", img: "images/pisi-tabagi.webp",
    blurb: "Tavadan yeni çıkmış, içi hava gibi 4 adet çıtır pişi.",
    items: [
      ["Sade Pişi", "200₺", "Mayalı hamurdan, siparişle kızartılan 4 adet sıcak pişi. Bal-kaymakla enfes."],
      ["Kaşarlı Pişi", "250₺", "İçine kaşar konularak kızartılır; kesince peynir uzar."],
      ["Beyaz Peynirli Pişi", "250₺", "Ezine beyaz peynir dolgulu, tuzlu pişi."],
      ["Nutellalı Pişi", "250₺", "İçi Nutella dolu, sıcak servis edilen tatlı pişi."],
      ["Kavurma Kaşar Pişi", "350₺", "Kavurma ve kaşar dolgulu, doyurucu pişi."],
    ],
  },
  {
    slug: "gozlemeler", name: "Gözlemeler", img: "images/breakfast.webp",
    blurb: "İnce açılmış hamur, sacda; peynirli, patatesli, kavurmalı.",
    items: [
      ["Kaşarlı Gözleme", "275₺", "İnce açılan hamura bol kaşar; sacda çıtır çıtır pişirilir."],
      ["Beyaz Peynirli Gözleme", "275₺", "Ezine beyaz peynir ve maydanozla; klasik köy gözlemesi."],
      ["Patatesli Gözleme", "275₺", "Baharatlı patates püresiyle; hafif ve doyurucu."],
      ["Patates Kaşarlı Gözleme", "300₺", "Patates ve kaşar bir arada; en çok tercih edilen ikili."],
      ["Kavurma Kaşarlı Gözleme", "400₺", "Kavurma ve kaşar dolgulu, etli gözleme."],
      ["Sucuklu Gözleme", "350₺", "Dilim sucuk ve baharatla; sacda pişer."],
      ["Sucuklu Kaşarlı Gözleme", "375₺", "Sucuk ve kaşarın bir arada olduğu doyurucu gözleme."],
    ],
  },
  {
    slug: "krep", name: "Krep & Pankek Çeşitleri", img: "images/meze.webp",
    blurb: "Tatlı taraf: Nutellalı, meyveli krep ve tereyağlı pankek.",
    note: "Nutella ve meyve ile servis edilir.",
    items: [
      ["Sade Krep", "150₺", "İnce Fransız usulü krep; pudra şekeriyle."],
      ["Nutellalı Krep", "275₺", "Bol Nutella ve mevsim meyveleriyle katlanır."],
      ["Pankek (4 Adet)", "400₺", "Kabarık 4 adet pankek; tereyağı, Nutella ve meyveyle sunulur."],
    ],
  },
  {
    slug: "ekstralar", name: "Ekstralar", img: "images/meze.webp",
    blurb: "Sofraya eklemelik: peynirler, bal-kaymak, zeytin, söğüş.",
    items: [
      ["Beyaz Peynir (1 Dilim)", "75₺", "Ezine tam yağlı beyaz peynir, tek dilim."],
      ["Kaşar Peyniri (1 Dilim)", "75₺", "Taze kaşar, tek dilim."],
      ["Çeçil Peyniri", "95₺", "İnce tel çeçil (örgü) peyniri."],
      ["Karışık Peynir Tabağı", "220₺", "Beyaz peynir, kaşar ve çeçilden oluşan üçlü tabak."],
      ["Tereyağı", "120₺", "Köy tereyağı; bal ve ekmekle."],
      ["Zeytin Tabağı", "120₺", "Yağlı siyah ve kırma yeşil zeytin, baharatlı."],
      ["Tahin Pekmez", "200₺", "Karışımı sofrada yapılan tahin-pekmez."],
      ["Söğüş", "150₺", "Mevsiminde domates, salatalık, biber ve maydanoz."],
      ["Acuka", "120₺", "Ceviz, biber salçası ve baharatla yoğrulan Antakya mezesi."],
      ["Haşlanmış Yumurta", "40₺", "Tam haşlanmış tek yumurta."],
      ["Bal Kaymak", "220₺", "Süzme çiçek balı ve manda kaymağı; pişiyle en iyisi."],
      ["Nutella", "150₺", "Porsiyon Nutella."],
      ["Reçel", "100₺", "Ev yapımı mevsim reçeli."],
      ["Simit", "45₺", "Günlük, susamlı taze simit."],
      ["Yeşillik", "120₺", "Marul, roka, maydanoz, taze soğandan tabak."],
    ],
  },
  {
    slug: "icecekler", name: "İçecekler", img: "images/hero.webp",
    blurb: "Sınırsız demli çay, taze sıkma portakal ve tüm kahveler.",
    subcols: [
      ["Soğuk İçecekler", [
        ["Su", "25₺", "0,5 lt kaynak suyu."],
        ["Sade Soda", "50₺", "Şişe maden suyu."],
        ["Meyveli Soda", "60₺", "Çeşitli meyve aromalı maden suyu."],
        ["Kola", "90₺", "Kutu kola (soğuk)."],
        ["Meyve Suyu", "75₺", "Kutu meyve suyu; çeşit için sorun."],
        ["Ice Tea", "75₺", "Şeftali veya limon aromalı soğuk çay."],
        ["Taze Sıkma Portakal Suyu", "175₺", "Sipariş üzerine, o an sıkılan portakal suyu."],
        ["Ayran", "50₺", "Çırpma ev ayranı, köpüklü."],
        ["Naneli Limonata", "150₺", "Taze limon ve naneyle hazırlanan ev limonatası."],
      ]],
      ["Sıcak İçecekler", [
        ["Çay", "40₺", "Demli tavşan kanı çay. Serpme sofralarda ilki ikramımız, devamı sınırsız."],
        ["Türk Kahvesi", "100₺", "Közde/ocakta pişen Türk kahvesi; yanında lokum."],
        ["Demleme Bitki Çayı", "100₺", "Ihlamur, adaçayı, kuşburnu; taze demlenir."],
        ["Espresso", "85₺", "Tek shot espresso."],
        ["Americano", "100₺", "Espresso üzerine sıcak su."],
        ["Latte", "120₺", "Espresso ve bol buharlı süt."],
        ["Cappuccino", "120₺", "Espresso, süt ve yoğun süt köpüğü."],
        ["Mocha", "120₺", "Espresso, çikolata ve süt."],
        ["Filtre Kahve", "100₺", "Günün filtre kahvesi."],
      ]],
    ],
  },
];

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;");

function itemLi(cat, [n, p, d], i) {
  return `                <li><button class="mi" type="button" data-name="${esc(n)}" data-price="${p}" data-cat="${esc(cat.name)}" data-img="${cat.img}" data-desc="${esc(d)}">
                  <img class="mi-thumb" src="${cat.img}" width="80" height="80" loading="lazy" decoding="async" alt="" />
                  <span class="mi-name">${esc(n)}</span><span class="dots"></span><span class="p">${p}</span>
                </button></li>`;
}
const itemList = (cat, items) =>
  `              <ul class="menu-list mi-list">\n${items.map((it, i) => itemLi(cat, it, i)).join("\n")}\n              </ul>`;

function head(title, desc) {
  return `<!DOCTYPE html>
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
  </header>`;
}

const FOOT = `  <footer class="site-footer">
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
          <p><a href="https://instagram.com/limoskahvalti" target="_blank" rel="noopener noreferrer">Instagram — @limoskahvalti</a></p>
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
    <a href="https://instagram.com/limoskahvalti" target="_blank" rel="noopener noreferrer" class="mobile-bar-btn">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
      <span>Instagram</span>
    </a>
  </nav>

  <div class="mi-dlg" id="mi-dlg" hidden>
    <div class="mi-dlg-backdrop" data-close></div>
    <div class="mi-dlg-box" role="dialog" aria-modal="true" aria-labelledby="mi-dlg-title">
      <button class="mi-dlg-x" type="button" data-close aria-label="Kapat">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
      <div class="mi-dlg-media"><img id="mi-dlg-img" src="" alt="" /></div>
      <div class="mi-dlg-body">
        <p class="mi-dlg-cat" id="mi-dlg-cat"></p>
        <h3 class="mi-dlg-title" id="mi-dlg-title"></h3>
        <p class="mi-dlg-price" id="mi-dlg-price"></p>
        <p class="mi-dlg-desc" id="mi-dlg-desc"></p>
      </div>
    </div>
  </div>

  <script src="js/script.js?${JS_V}" defer></script>
</body>
</html>
`;

CATS.forEach((cat, i) => {
  const num = String(i + 1).padStart(2, "0");
  const prev = CATS[(i - 1 + CATS.length) % CATS.length];
  const next = CATS[(i + 1) % CATS.length];

  const side = CATS.map((c) =>
    `            <a href="menu-${c.slug}.html"${c.slug === cat.slug ? ' aria-current="page" class="is-current"' : ""}>${esc(c.name)}</a>`
  ).join("\n");

  let mainInner;
  if (cat.subcols) {
    mainInner =
      `            <div class="menu-subcols">\n` +
      cat.subcols.map(([t, items]) =>
        `              <div class="menu-subcol">\n                <h4 class="menu-subtitle">${esc(t)}</h4>\n${itemList(cat, items)}\n              </div>`
      ).join("\n") +
      `\n            </div>`;
  } else {
    mainInner = itemList(cat, cat.items);
    if (cat.note) mainInner += `\n            <p class="menu-cat-note">${esc(cat.note)}</p>`;
  }

  const html = `${head(cat.name.replace(" / ", " ve "), `Limos Kahvaltı ${cat.name} kategorisi, fiyatları ve içerikleri.`)}

  <main>
    <section class="menu-hero cat-hero">
      <div class="container">
        <a class="cat-back" href="menu.html">← Tüm menü</a>
        <p class="sec-index sec-index--light">Menü · ${num} / 08</p>
        <h1 class="display display--light" id="cat-baslik">${esc(cat.name)}${cat.nameSmall ? ` <small>${cat.nameSmall}</small>` : ""}</h1>
        <p class="sec-sub sec-sub--light cat-blurb">${esc(cat.blurb)}</p>
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

${FOOT}`;

  const file = path.join(ROOT, `menu-${cat.slug}.html`);
  fs.writeFileSync(file, html, "utf8");
  const cnt = cat.subcols ? cat.subcols.reduce((n, s) => n + s[1].length, 0) : cat.items.length;
  console.log("yazıldı:", path.basename(file), `(${cnt} ürün)`);
});

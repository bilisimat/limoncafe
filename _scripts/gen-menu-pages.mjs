/* Menü kategori sayfalarını üretir: menu-<slug>.html
   Kategori + ürün listesi KLASÖRE göredir: _scripts/menu-items.json (menu-images.mjs üretir).
   Fiyat / açıklama bu dosyadaki PRICE / DESC tablolarından gelir; olmayan ürün fiyatsız çıkar.
   Ayrıca menu.html içindeki kategori kartlarını da günceller.
   Çalıştır:  node _scripts/menu-images.mjs  &&  node _scripts/gen-menu-pages.mjs */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(".");
const CSS_V = "v=33";
const JS_V = "v=11";

const IMG = JSON.parse(fs.readFileSync(path.resolve("_scripts/menu-images.json"), "utf8"));
const ITEMS = JSON.parse(fs.readFileSync(path.resolve("_scripts/menu-items.json"), "utf8"));

/* ---- kategori tanımları (sıra buradaki sıradır) ---- */
const META = {
  serpme: {
    name: "Serpme & Tabaklar",
    blurb: "Sofranın tamamı: serpme kahvaltılar ve tek kişilik tabaklar. İlk çay ikramımızdır.",
    card: "Serpme kahvaltılar ve tek kişilik tabaklar. İlk çay ikramımızdır.",
    order: ["Limos Serpme Kahvaltı", "Full Serpme Kahvaltı", "Special Serpme Kahvaltı", "Kahvaltı Tabağı", "Pişi Tabağı"],
  },
  menemenler: {
    name: "Menemenler",
    blurb: "Tereyağında domates-biber, üstüne yumurta; klasikten kavurmalıya.",
    card: "Tereyağında domates-biber, üstüne yumurta; klasikten kavurmalıya.",
    order: ["Klasik Menemen", "Kaşarlı Menemen", "Beyaz Peynirli Menemen", "Karışık Menemen", "Kavurmalı Menemen", "Sucuklu Menemen"],
  },
  yumurta: {
    name: "Sahanda Yumurtalar",
    blurb: "Bakır sahanda pişen yumurta; sadeden sucuklu, sosisli, kavurmalıya.",
    card: "Bakır sahanda; sadeden sucuklu, sosisli, kavurmalıya.",
    order: ["Sade Yumurta", "Kaşarlı Yumurta", "Beyaz Peynirli Yumurta", "Sucuklu Yumurta", "Sosisli Yumurta", "Patatesli Yumurta", "Kavurmalı Yumurta"],
  },
  omletler: {
    name: "Omletler",
    blurb: "Bakır tavada kabaran omlet; kaşarlı, sucuklu, kıymalı, karışık.",
    card: "Kabaran omlet; kaşarlı, sucuklu, kıymalı, karışık.",
    order: ["Sade Omlet", "Kaşarlı Omlet", "Beyaz Peynirli Omlet", "Karışık Omlet", "Sucuklu Omlet", "Sosisli Omlet", "Patatesli Omlet", "Kıymalı Omlet", "Kavurmalı Omlet"],
  },
  tavalar: {
    name: "Tavalar",
    blurb: "Bakır tavada sıcacık: mıhlama, sucuk, kavurma, sigara böreği.",
    card: "Bakır tavada sıcacık: mıhlama, sucuk, kavurma, sigara böreği.",
    order: ["Mıhlama (Kuymak)", "Sucuk Tava", "Sıcak Tabağı", "Kavurma Tava", "Hellim Tava", "Sosis Tava", "Salçalı Sosis", "Anne Dilim Patates Tava", "Sigara Böreği", "Yumurtalı Ekmek"],
  },
  pisiler: {
    name: "Pişiler", nameSmall: "(4 Adet)",
    blurb: "Tavadan yeni çıkmış, içi hava gibi 4 adet çıtır pişi.",
    card: "Tavadan yeni çıkmış, içi hava gibi çıtır pişiler.",
    order: ["Sade Pişi", "Kaşarlı Pişi", "Beyaz Peynirli Pişi", "Sucuklu Pişi", "Nutella'lı Pişi", "Kavurma Kaşarlı Pişi"],
  },
  gozlemeler: {
    name: "Gözlemeler",
    blurb: "İnce açılmış hamur, sacda; peynirli, patatesli, kavurmalı.",
    card: "İnce açılmış hamur, sacda; peynirli, patatesli, kavurmalı.",
    order: ["Kaşarlı Gözleme", "Beyaz Peynirli Gözleme", "Patatesli Gözleme", "Patatesli Kaşarlı Gözleme", "Ispanaklı Gözleme", "Kıymalı Gözleme", "Sucuklu Gözleme", "Sucuklu Kaşarlı Gözleme", "Kavurmalı Kaşarlı Gözleme"],
  },
  krep: {
    name: "Krep & Pankek Çeşitleri",
    blurb: "Tatlı taraf: Nutellalı krep ve tereyağlı pankek.",
    card: "Tatlı taraf: Nutellalı krep ve tereyağlı pankek.",
    note: "Nutella ve meyve ile servis edilir.",
    order: ["Sade Krep", "Nutella'lı Krep", "Pankek"],
  },
  ekstralar: {
    name: "Ekstralar",
    blurb: "Sofraya eklemelik: peynirler, bal-kaymak, zeytin, söğüş.",
    card: "Sofraya eklemelik: peynirler, bal-kaymak, zeytin, söğüş.",
    order: ["Beyaz Peynir", "Kaşar Peyniri", "Çeçil Peynir", "Karışık Peynir Tabağı", "Tereyağı", "Bal & Kaymak", "Tahin Pekmez", "Reçel", "Nutella", "Zeytin Tabağı", "Söğüş", "Yeşillik", "Acuka", "Biber Kızartması", "Yoğurt", "Haşlanmış Yumurta", "Simit"],
  },
  icecekler: {
    name: "İçecekler",
    blurb: "Sınırsız demli çay, taze sıkma portakal ve tüm kahveler.",
    card: "Sınırsız demli çay, taze sıkma portakal ve tüm kahveler.",
    subcols: [
      ["Soğuk İçecekler", ["Su", "Sade Soda", "Meyveli Soda", "Ayran", "Coca-Cola", "Coca-Cola Zero", "Naneli Limonata", "Taze Sıkma Portakal Suyu", "Karışık Meyve Suyu", "Vişne Suyu", "Şeftali Suyu", "Ice Tea Şeftali", "Ice Tea Limon", "Süt"]],
      ["Sıcak İçecekler", ["Çay", "Türk Kahvesi", "Espresso", "Americano", "Latte", "Cappuccino", "Mocha", "Filtre Kahve"]],
    ],
  },
};

/* ---- fiyatlar (işletme-bilgileri.md). Listede olmayan ürün fiyatsız. ---- */
const PRICE = {
  "Kahvaltı Tabağı": "450₺", "Pişi Tabağı": "350₺",
  "Klasik Menemen": "220₺", "Kaşarlı Menemen": "250₺", "Beyaz Peynirli Menemen": "250₺", "Karışık Menemen": "350₺", "Kavurmalı Menemen": "370₺", "Sucuklu Menemen": "330₺",
  "Sade Yumurta": "150₺", "Kaşarlı Yumurta": "200₺", "Beyaz Peynirli Yumurta": "200₺", "Sucuklu Yumurta": "270₺", "Patatesli Yumurta": "200₺", "Kavurmalı Yumurta": "350₺",
  "Mıhlama (Kuymak)": "300₺", "Sucuk Tava": "300₺", "Kavurma Tava": "350₺", "Hellim Tava": "200₺", "Sosis Tava": "250₺", "Salçalı Sosis": "300₺", "Anne Dilim Patates Tava": "180₺", "Sigara Böreği": "120₺", "Yumurtalı Ekmek": "150₺",
  "Sade Pişi": "200₺", "Kaşarlı Pişi": "250₺", "Beyaz Peynirli Pişi": "250₺", "Nutella'lı Pişi": "250₺", "Kavurma Kaşarlı Pişi": "350₺",
  "Kaşarlı Gözleme": "275₺", "Beyaz Peynirli Gözleme": "275₺", "Patatesli Gözleme": "275₺", "Patatesli Kaşarlı Gözleme": "300₺", "Kavurmalı Kaşarlı Gözleme": "400₺", "Sucuklu Gözleme": "350₺", "Sucuklu Kaşarlı Gözleme": "375₺",
  "Sade Krep": "150₺", "Nutella'lı Krep": "275₺", "Pankek": "400₺",
  "Beyaz Peynir": "75₺", "Kaşar Peyniri": "75₺", "Çeçil Peynir": "95₺", "Karışık Peynir Tabağı": "220₺", "Tereyağı": "120₺", "Bal & Kaymak": "220₺", "Tahin Pekmez": "200₺", "Reçel": "100₺", "Nutella": "150₺", "Zeytin Tabağı": "120₺", "Söğüş": "150₺", "Yeşillik": "120₺", "Acuka": "120₺", "Haşlanmış Yumurta": "40₺", "Simit": "45₺",
  "Su": "25₺", "Sade Soda": "50₺", "Meyveli Soda": "60₺", "Ayran": "50₺", "Coca-Cola": "90₺", "Naneli Limonata": "150₺", "Taze Sıkma Portakal Suyu": "175₺", "Karışık Meyve Suyu": "75₺", "Ice Tea Şeftali": "75₺",
  "Çay": "40₺", "Türk Kahvesi": "100₺", "Espresso": "85₺", "Americano": "100₺", "Latte": "120₺", "Cappuccino": "120₺", "Mocha": "120₺", "Filtre Kahve": "100₺",
};

/* ---- kısa açıklamalar (pop-up) ---- */
const DESC = {
  "Limos Serpme Kahvaltı": "Sofrayı dolduran serpme kahvaltı: peynirler, kahvaltılıklar, sıcaklar ve sınırsız çay bir arada.",
  "Full Serpme Kahvaltı": "Limos serpmenin daha geniş hâli; menemen, mıhlama, sucuk ve pişilerle donatılmış tam sofra.",
  "Special Serpme Kahvaltı": "En kapsamlı serpme; mevsim ürünleri ve sıcak tabaklarıyla kalabalık sofralar için.",
  "Kahvaltı Tabağı": "Tek kişilik: Ezine beyaz peynir, taze kaşar, domates, salatalık, bal, kaymak, ev reçeli, zeytin, omlet ve 1 sigara böreği. İlk çay ikram.",
  "Pişi Tabağı": "Tek kişilik: 3 adet sade pişi, domates, salatalık, Ezine beyaz peynir, ev reçeli ve zeytin. İlk çay ikram.",

  "Klasik Menemen": "Domates ve yeşil biberin tereyağında yumuşayıp yumurtayla buluştuğu sade menemen. Sahanda, sıcak servis edilir.",
  "Kaşarlı Menemen": "Klasik menemenin üzerine bol taze kaşar; tavada eriyerek ipek gibi bir kıvam bırakır.",
  "Beyaz Peynirli Menemen": "Ezine beyaz peynirle hazırlanır; hafif tuzlu, ferah bir tat. Yanında ekmekle güzel gider.",
  "Karışık Menemen": "Domates, biber, sucuk, kavurma ve kaşar bir arada. Sofranın en doyurucu menemeni.",
  "Kavurmalı Menemen": "El kavurması eti kendi yağında çevrilip menemene katılır. Yoğun, etli bir lezzet.",
  "Sucuklu Menemen": "Dilimlenmiş sucuk tavada yağını bırakana kadar kızarır, menemenle harmanlanır.",

  "Sade Yumurta": "İki yumurta bakır sahanda, tereyağında pişirilir. Sarısı akışkan ister misiniz, söyleyin.",
  "Kaşarlı Yumurta": "Sahanda yumurtanın üzerine eriyen taze kaşar. Basit ama tam kıvamında.",
  "Beyaz Peynirli Yumurta": "Ezine beyaz peynir parçalarıyla; tuzlu-ferah bir kahvaltı klasiği.",
  "Sucuklu Yumurta": "Bakır sahanda kızaran sucuk dilimleri, üzerine yumurta. Yağı ekmekle silinir.",
  "Sosisli Yumurta": "Dana sosis dilimleri sahanda kızarır, üzerine yumurta kırılır.",
  "Patatesli Yumurta": "Küp doğranmış patates altın rengi kızartılır, yumurtayla bağlanır.",
  "Kavurmalı Yumurta": "Kendi yağında çevrilmiş kavurma etinin üzerine kırılan yumurtalar. Doyurucu.",

  "Sade Omlet": "Çırpılmış yumurta bakır tavada kabartılır; hafif ve yumuşak.",
  "Kaşarlı Omlet": "İçi eriyen taze kaşarla dolu omlet. Mekânın en çok tercih edileni.",
  "Beyaz Peynirli Omlet": "Ezine beyaz peynir ve maydanozla; ferah bir omlet.",
  "Karışık Omlet": "Sucuk, kaşar ve biberle zenginleştirilmiş omlet.",
  "Sucuklu Omlet": "Kızarmış sucuk dilimleriyle katlanan omlet.",
  "Sosisli Omlet": "Dana sosis parçalarıyla hazırlanan omlet.",
  "Patatesli Omlet": "Kızarmış patatesle doldurulan doyurucu omlet.",
  "Kıymalı Omlet": "Baharatlı kıyma sotesiyle katlanan omlet.",
  "Kavurmalı Omlet": "Kendi yağında çevrilmiş kavurmayla; etli ve yoğun.",

  "Mıhlama (Kuymak)": "Karadeniz usulü; tereyağı, mısır unu ve taze peynirle çekilen, telli akan kuymak.",
  "Sucuk Tava": "Dilim sucuk kendi yağında, kenarları çıtır olacak şekilde kızartılır.",
  "Sıcak Tabağı": "Günün sıcakları bir tabakta: mıhlama, sucuk, patates ve sigara böreğinden seçki.",
  "Kavurma Tava": "El kavurması kendi yağında çevrilir; yanında ekmekle.",
  "Hellim Tava": "Izgara-tava hellim; dışı kızarmış, içi yumuşak. Limon sıkarak servis edilir.",
  "Sosis Tava": "Dana sosis dilimlenip tavada kızartılır.",
  "Salçalı Sosis": "Sosisler domates-biber salçasıyla tavada buluşur; hafif baharatlı.",
  "Anne Dilim Patates Tava": "Elde iri dilimlenen patates, bol yağda çıtır çıtır kızartılır.",
  "Sigara Böreği": "Beyaz peynir ve maydanozla sarılıp kızartılmış 6 adet ince börek.",
  "Yumurtalı Ekmek": "Yumurtaya batırılıp tereyağında kızartılmış 6 dilim ekmek. Çocukların favorisi.",

  "Sade Pişi": "Mayalı hamurdan, siparişle kızartılan 4 adet sıcak pişi. Bal-kaymakla enfes.",
  "Kaşarlı Pişi": "İçine kaşar konularak kızartılır; kesince peynir uzar.",
  "Beyaz Peynirli Pişi": "Ezine beyaz peynir dolgulu, tuzlu pişi.",
  "Sucuklu Pişi": "İçi kızarmış sucukla doldurulan sıcak pişi.",
  "Nutella'lı Pişi": "İçi Nutella dolu, sıcak servis edilen tatlı pişi.",
  "Kavurma Kaşarlı Pişi": "Kavurma ve kaşar dolgulu, doyurucu pişi.",

  "Kaşarlı Gözleme": "İnce açılan hamura bol kaşar; sacda çıtır çıtır pişirilir.",
  "Beyaz Peynirli Gözleme": "Ezine beyaz peynir ve maydanozla; klasik köy gözlemesi.",
  "Patatesli Gözleme": "Baharatlı patates püresiyle; hafif ve doyurucu.",
  "Patatesli Kaşarlı Gözleme": "Patates ve kaşar bir arada; en çok tercih edilen ikili.",
  "Ispanaklı Gözleme": "Sotelenmiş ıspanak ve lor/peynirle hazırlanan gözleme.",
  "Kıymalı Gözleme": "Baharatlı kıyma harcıyla; sacda pişer.",
  "Sucuklu Gözleme": "Dilim sucuk ve baharatla; sacda pişer.",
  "Sucuklu Kaşarlı Gözleme": "Sucuk ve kaşarın bir arada olduğu doyurucu gözleme.",
  "Kavurmalı Kaşarlı Gözleme": "Kavurma ve kaşar dolgulu, etli gözleme.",

  "Sade Krep": "İnce Fransız usulü krep; pudra şekeriyle.",
  "Nutella'lı Krep": "Bol Nutella ve mevsim meyveleriyle katlanır.",
  "Pankek": "Kabarık 4 adet pankek; tereyağı, Nutella ve meyveyle sunulur.",

  "Beyaz Peynir": "Ezine tam yağlı beyaz peynir, tek dilim.",
  "Kaşar Peyniri": "Taze kaşar, tek dilim.",
  "Çeçil Peynir": "İnce tel çeçil (örgü) peyniri.",
  "Karışık Peynir Tabağı": "Beyaz peynir, kaşar ve çeçilden oluşan üçlü tabak.",
  "Tereyağı": "Köy tereyağı; bal ve ekmekle.",
  "Bal & Kaymak": "Süzme çiçek balı ve manda kaymağı; pişiyle en iyisi.",
  "Tahin Pekmez": "Karışımı sofrada yapılan tahin-pekmez.",
  "Reçel": "Ev yapımı mevsim reçeli.",
  "Nutella": "Porsiyon Nutella.",
  "Zeytin Tabağı": "Yağlı siyah ve kırma yeşil zeytin, baharatlı.",
  "Söğüş": "Mevsiminde domates, salatalık, biber ve maydanoz.",
  "Yeşillik": "Marul, roka, maydanoz, taze soğandan tabak.",
  "Acuka": "Ceviz, biber salçası ve baharatla yoğrulan Antakya mezesi.",
  "Biber Kızartması": "Sivri biberler kızartılıp sarımsaklı yoğurtla servis edilir.",
  "Yoğurt": "Porsiyon süzme yoğurt.",
  "Haşlanmış Yumurta": "Tam haşlanmış tek yumurta.",
  "Simit": "Günlük, susamlı taze simit.",

  "Su": "0,5 lt kaynak suyu.",
  "Sade Soda": "Şişe maden suyu.",
  "Meyveli Soda": "Çeşitli meyve aromalı maden suyu.",
  "Ayran": "Çırpma ev ayranı, köpüklü.",
  "Coca-Cola": "Kutu kola (soğuk).",
  "Coca-Cola Zero": "Şekersiz kutu kola (soğuk).",
  "Naneli Limonata": "Taze limon ve naneyle hazırlanan ev limonatası.",
  "Taze Sıkma Portakal Suyu": "Sipariş üzerine, o an sıkılan portakal suyu.",
  "Karışık Meyve Suyu": "Kutu meyve suyu; çeşit için sorun.",
  "Vişne Suyu": "Kutu vişne suyu.",
  "Şeftali Suyu": "Kutu şeftali suyu.",
  "Ice Tea Şeftali": "Şeftali aromalı soğuk çay.",
  "Ice Tea Limon": "Limon aromalı soğuk çay.",
  "Süt": "Bardak sıcak veya soğuk süt.",
  "Çay": "Demli tavşan kanı çay. Serpme sofralarda ilki ikramımız, devamı sınırsız.",
  "Türk Kahvesi": "Közde/ocakta pişen Türk kahvesi; yanında lokum.",
  "Espresso": "Tek shot espresso.",
  "Americano": "Espresso üzerine sıcak su.",
  "Latte": "Espresso ve bol buharlı süt.",
  "Cappuccino": "Espresso, süt ve yoğun süt köpüğü.",
  "Mocha": "Espresso, çikolata ve süt.",
  "Filtre Kahve": "Günün filtre kahvesi.",
};

/* ---- kategori sırası + ürün sırası kur ---- */
const SLUGS = Object.keys(META);
const CATS = SLUGS.map((slug) => {
  const m = META[slug];
  const pool = ITEMS[slug] || [];
  const order = (m.order || []).filter((n) => pool.includes(n));
  const rest = pool.filter((n) => !order.includes(n));
  const names = order.concat(rest);
  return { slug, ...m, names };
});
const TOT = String(CATS.length).padStart(2, "0");

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
const FALLBACK = "images/hero.webp";
function pics(slug, name) {
  const m = (IMG[slug] || {})[name];
  return { t: (m && m.t) || FALLBACK, b: (m && m.b) || FALLBACK };
}

function itemLi(slug, catName, name) {
  const im = pics(slug, name);
  const p = PRICE[name] || "";
  const d = DESC[name] || "";
  const priceSpan = p ? `<span class="p">${p}</span>` : "";
  return `                <li><button class="mi" type="button" data-name="${esc(name)}" data-price="${esc(p)}" data-cat="${esc(catName)}" data-img="${im.b}" data-desc="${esc(d)}">
                  <img class="mi-thumb" src="${im.t}" width="80" height="80" loading="lazy" decoding="async" alt="" />
                  <span class="mi-name">${esc(name)}</span><span class="dots"></span>${priceSpan}
                </button></li>`;
}
const itemList = (slug, catName, names) =>
  `              <ul class="menu-list mi-list">\n${names.map((n) => itemLi(slug, catName, n)).join("\n")}\n              </ul>`;

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
      cat.subcols.map(([t, names]) => {
        const present = names.filter((n) => (cat.names || []).includes(n));
        return `              <div class="menu-subcol">\n                <h4 class="menu-subtitle">${esc(t)}</h4>\n${itemList(cat.slug, cat.name, present)}\n              </div>`;
      }).join("\n") +
      `\n            </div>`;
  } else {
    mainInner = itemList(cat.slug, cat.name, cat.names);
    if (cat.note) mainInner += `\n            <p class="menu-cat-note">${esc(cat.note)}</p>`;
  }

  const html = `${head(cat.name, `Limos Kahvaltı ${cat.name} kategorisi, fiyatları ve içerikleri.`)}

  <main>
    <section class="menu-hero cat-hero">
      <div class="container">
        <a class="cat-back" href="menu.html">← Tüm menü</a>
        <p class="sec-index sec-index--light">Menü · ${num} / ${TOT}</p>
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
  const cnt = cat.subcols
    ? cat.subcols.reduce((n, s) => n + s[1].filter((x) => cat.names.includes(x)).length, 0)
    : cat.names.length;
  console.log("yazıldı:", path.basename(file), `(${cnt} ürün)`);
});

/* ---- menu.html kategori kartlarını güncelle ---- */
const ARROW = `<svg class="cat-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;
const cards = CATS.map((c) => {
  const small = c.nameSmall ? ` <small>${c.nameSmall}</small>` : "";
  return `          <a class="cat-card" href="menu-${c.slug}.html">
            <span class="cat-thumb" aria-hidden="true"></span>
            <span class="cat-name">${esc(c.name)}${small}<span class="cat-desc">${esc(c.card || c.blurb)}</span></span>
            ${ARROW}
          </a>`;
}).join("\n");

const menuPath = path.join(ROOT, "menu.html");
let menuHtml = fs.readFileSync(menuPath, "utf8");
const re = /(<div class="cat-list">\n)[\s\S]*?(\n {8}<\/div>)/;
if (re.test(menuHtml)) {
  menuHtml = menuHtml.replace(re, `$1${cards}$2`);
  fs.writeFileSync(menuPath, menuHtml, "utf8");
  console.log("güncellendi: menu.html kartları (" + CATS.length + " kategori)");
} else {
  console.log("UYARI: menu.html içinde .cat-list bloğu bulunamadı");
}

/* "menü görselleri/" içindeki ham fotoğrafları web'e uygun webp'lere indirger.
   Çıktı: images/menu/<catSlug>/<itemSlug>-t.webp (thumb) + -b.webp (pop-up).
   Ayrıca _scripts/menu-images.json (ürün adı -> yol) yazar; gen-menu-pages.mjs bunu okur.
   Çalıştır:  node _scripts/menu-images.mjs   (sharp gerekli: npm i --no-save sharp) */
import sharp from "sharp";
import fs from "fs";
import path from "path";

const SRC = path.resolve("menü görselleri");
const OUT = path.resolve("images/menu");

const trMap = { "ç": "c", "Ç": "c", "ğ": "g", "Ğ": "g", "ı": "i", "İ": "i", "ö": "o", "Ö": "o", "ş": "s", "Ş": "s", "ü": "u", "Ü": "u" };
const slug = (s) => s.replace(/[çÇğĞıİöÖşŞüÜ]/g, (m) => trMap[m])
  .toLowerCase().replace(/&/g, " ve ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/* catSlug -> { "Menü ürün adı (gen-menu-pages ile birebir)": "AltKlasör/Dosya.jpg" } */
const MAP = {
  menemenler: {
    "Klasik Menemen": "Menemenler/Klasik Menemen.jpg",
    "Kaşarlı Menemen": "Menemenler/Kaşşarlı Menemen.jpg",
    "Beyaz Peynirli Menemen": "Menemenler/Beyaz Peynirli Menemen.jpg",
    "Karışık Menemen": "Menemenler/Karışık Menemen.jpg",
    "Kavurmalı Menemen": "Menemenler/Kavurmalı Menemen.jpg",
    "Sucuklu Menemen": "Menemenler/Sucuklu Menemen.jpg",
  },
  yumurta: {
    "Sade Yumurta": "Sahanda Yumurtalar/Sade Yumurta.jpg",
    "Kaşarlı Yumurta": "Sahanda Yumurtalar/Kaşarlı Yumurta.jpg",
    "Beyaz Peynirli Yumurta": "Sahanda Yumurtalar/Beyaz Peynirli Yumurta.jpg",
    "Karışık Yumurta": "Omletler/Karışık Omlet.jpg",
    "Kavurmalı Yumurta": "Sahanda Yumurtalar/Kavurmalı Yumurta.jpg",
    "Sucuklu Yumurta": "Sahanda Yumurtalar/Sucuklu Yumurta.jpg",
    "Patatesli Yumurta": "Sahanda Yumurtalar/Patatesli Yumurta.jpg",
    "Mantar Kaşar Yumurta": "Omletler/Kaşarlı Omlet.jpg",
  },
  tavalar: {
    "Mıhlama": "Tavalar/Mıhlama (Kuymak).jpg",
    "Sucuk Tava": "Tavalar/Sucuk Tava.jpg",
    "Hellim Tava": "Tavalar/Hellim Tava.jpg",
    "Kavurma Tava": "Tavalar/Kavurma Tava.jpg",
    "Yumurtalı Ekmek (6)": "Tavalar/Yumurtalı Ekmek.jpg",
    "Sosis Tava": "Tavalar/Sosis Tava.jpg",
    "Salçalı Sosis": "Tavalar/Salçalı Sosis.jpg",
    "Patates Tava": "Tavalar/Anne Dilim Patates Tava.jpg",
    "Sigara Böreği (6)": "Tavalar/Sigara Böreği.jpg",
  },
  pisiler: {
    "Sade Pişi": "Pişiler/Sade Pişi.jpg",
    "Kaşarlı Pişi": "Pişiler/Kaşarlı Pişi.jpg",
    "Beyaz Peynirli Pişi": "Pişiler/Beyaz Peynirli Pişi.jpg",
    "Nutellalı Pişi": "Pişiler/Nutella'lı Pişi.jpg",
    "Kavurma Kaşar Pişi": "Pişiler/Kavurma Kaşarlı Pişi.jpg",
  },
  gozlemeler: {
    "Kaşarlı Gözleme": "Gözlemezler/Kaşarlı Gözleme.jpg",
    "Beyaz Peynirli Gözleme": "Gözlemezler/Beyaz Peynirli Gözleme.jpg",
    "Patatesli Gözleme": "Gözlemezler/Patatesli Gözleme.jpg",
    "Patates Kaşarlı Gözleme": "Gözlemezler/Patatesli Kaşarlı Gözleme.jpg",
    "Kavurma Kaşarlı Gözleme": "Gözlemezler/Kavurmalı Kaşarlı Gözleme.jpg",
    "Sucuklu Gözleme": "Gözlemezler/Sucuklu Gözleme.jpg",
    "Sucuklu Kaşarlı Gözleme": "Gözlemezler/Sucuklu Kaşarlı Gözleme.jpg",
  },
  krep: {
    "Sade Krep": "Krep & Pankek Çeşitleri/Sade Krep.jpg",
    "Nutellalı Krep": "Krep & Pankek Çeşitleri/Nutella'lı Krep.jpg",
    "Pankek (4 Adet)": "Krep & Pankek Çeşitleri/Pankek.jpg",
  },
  ekstralar: {
    "Beyaz Peynir (1 Dilim)": "Ekstralar/Beyaz Peynir.jpg",
    "Kaşar Peyniri (1 Dilim)": "Ekstralar/Kaşar Peyniri.jpg",
    "Çeçil Peyniri": "Ekstralar/Çeçil Peynir.jpg",
    "Karışık Peynir Tabağı": "Ekstralar/Karışık Peynir Tabağı.jpg",
    "Tereyağı": "Ekstralar/Tereyağı.jpg",
    "Zeytin Tabağı": "Ekstralar/Zeytin Tabağı.jpg",
    "Tahin Pekmez": "Ekstralar/Tahin Pekmez.jpg",
    "Söğüş": "Ekstralar/Söğüş.jpg",
    "Acuka": "Ekstralar/Acuka.jpg",
    "Haşlanmış Yumurta": "Ekstralar/Haşlanmış Yumurta.jpg",
    "Bal Kaymak": "Ekstralar/Bal & Kaymak.jpg",
    "Nutella": "Ekstralar/Nutella.jpg",
    "Reçel": "Ekstralar/Reçel.jpg",
    "Simit": "Ekstralar/Simit.jpg",
    "Yeşillik": "Ekstralar/Yeşillik.jpg",
  },
  icecekler: {
    "Su": "İçecekler/Su.jpg",
    "Sade Soda": "İçecekler/Sade Soda.jpg",
    "Meyveli Soda": "İçecekler/Meyveli Soda.jpg",
    "Kola": "İçecekler/Coca'cola .jpg",
    "Meyve Suyu": "İçecekler/Karışık Meyve Suyu.jpg",
    "Ice Tea": "İçecekler/Ice Tea Şeftali.jpg",
    "Taze Sıkma Portakal Suyu": "İçecekler/Taze Sıkma Portakal Suyu.jpg",
    "Ayran": "İçecekler/Ayran.jpg",
    "Naneli Limonata": "İçecekler/Naneli Limonata.jpg",
    "Çay": "İçecekler/Çay.jpg",
    "Türk Kahvesi": "İçecekler/Türk Kahvesi.jpg",
    "Demleme Bitki Çayı": "İçecekler/Çay.jpg",
    "Espresso": "İçecekler/Espresso.jpg",
    "Americano": "İçecekler/Americano.jpg",
    "Latte": "İçecekler/Latte.jpg",
    "Cappuccino": "İçecekler/Cappuccino.jpg",
    "Mocha": "İçecekler/Mocha,.jpg",
    "Filtre Kahve": "İçecekler/Filtre Kahve.jpg",
  },
};

const manifest = {};
let ok = 0, miss = 0;

for (const [cat, items] of Object.entries(MAP)) {
  const dir = path.join(OUT, cat);
  fs.mkdirSync(dir, { recursive: true });
  manifest[cat] = {};
  for (const [name, rel] of Object.entries(items)) {
    const src = path.join(SRC, rel);
    if (!fs.existsSync(src)) { console.log("EKSİK:", rel); miss++; continue; }
    const base = slug(name);
    const tOut = path.join(dir, base + "-t.webp");
    const bOut = path.join(dir, base + "-b.webp");
    await sharp(src).rotate().resize({ width: 220, height: 220, fit: "cover" }).webp({ quality: 68 }).toFile(tOut);
    await sharp(src).rotate().resize({ width: 1100, height: 1100, fit: "inside", withoutEnlargement: true }).webp({ quality: 80 }).toFile(bOut);
    manifest[cat][name] = { t: `images/menu/${cat}/${base}-t.webp`, b: `images/menu/${cat}/${base}-b.webp` };
    ok++;
  }
}

fs.writeFileSync(path.resolve("_scripts/menu-images.json"), JSON.stringify(manifest, null, 2), "utf8");
console.log(`\nbitti: ${ok} ürün görseli, ${miss} eksik. manifest -> _scripts/menu-images.json`);

/* "menü görselleri/" içindeki ham fotoğrafları web'e uygun webp'lere indirger.
   Kategori ve ürün listesi KLASÖRE göredir (klasör = doğruluk kaynağı).
   Çıktı:
     images/menu/<catSlug>/<itemSlug>-t.webp  (thumb 220px)
     images/menu/<catSlug>/<itemSlug>-b.webp  (pop-up 1100px)
     _scripts/menu-images.json  -> { catSlug: { "Ürün Adı": { t, b } } }
     _scripts/menu-items.json   -> { catSlug: ["Ürün Adı", ...] }  (klasör sırası)
   Çalıştır:  node _scripts/menu-images.mjs   (sharp gerekli: npm i --no-save sharp) */
import sharp from "sharp";
import fs from "fs";
import path from "path";

const SRC = path.resolve("menü görselleri");
const OUT = path.resolve("images/menu");

const trMap = { "ç": "c", "Ç": "c", "ğ": "g", "Ğ": "g", "ı": "i", "İ": "i", "ö": "o", "Ö": "o", "ş": "s", "Ş": "s", "ü": "u", "Ü": "u" };
const slug = (s) => s.replace(/[çÇğĞıİöÖşŞüÜ]/g, (m) => trMap[m])
  .toLowerCase().replace(/&/g, " ve ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/* dosya adını (uzantısız) ekranda görünecek temiz ada çevir */
function cleanName(base) {
  let n = base.trim();
  n = n.replace(/\s*\(\d+\)$/, "");            // "Reçel (2)" -> "Reçel"
  n = n.replace(/,+$/, "");                     // "Mocha," -> "Mocha"
  n = n.replace(/Kaşşarlı/g, "Kaşarlı");        // kaynak yazım hatası
  n = n.replace(/Coca'cola/gi, "Coca-Cola");    // "Coca'cola" -> "Coca-Cola"
  return n.trim();
}

/* klasör -> { slug, name }  (kategori sırası buradaki sıradır) */
const FOLDERS = [
  { dir: "__serpme__", slug: "serpme", name: "Serpme & Tabaklar" },
  { dir: "Menemenler", slug: "menemenler", name: "Menemenler" },
  { dir: "Sahanda Yumurtalar", slug: "yumurta", name: "Sahanda Yumurtalar" },
  { dir: "Omletler", slug: "omletler", name: "Omletler" },
  { dir: "Tavalar", slug: "tavalar", name: "Tavalar" },
  { dir: "Pişiler", slug: "pisiler", name: "Pişiler" },
  { dir: "Gözlemezler", slug: "gozlemeler", name: "Gözlemeler" },
  { dir: "Krep & Pankek Çeşitleri", slug: "krep", name: "Krep & Pankek Çeşitleri" },
  { dir: "Ekstralar", slug: "ekstralar", name: "Ekstralar" },
  { dir: "İçecekler", slug: "icecekler", name: "İçecekler" },
];

/* "Serpme & Tabaklar": kökteki serpme görselleri + "Kahvaltı Tabakları/" klasörü */
const SERPME = [
  { name: "Limos Serpme Kahvaltı", file: "Limos Serpme Kahvaltı.jpg" },
  { name: "Full Serpme Kahvaltı", file: "Full Serpme Kahvaltı.jpg" },
  { name: "Special Serpme Kahvaltı", file: "Special Serpme Kahvaltı.jpg" },
  { name: "Kahvaltı Tabağı", file: "Kahvaltı Tabakları/Kahvaltı Tabağı.jpg" },
  { name: "Pişi Tabağı", file: "Kahvaltı Tabakları/Pişi Tabağı.jpg" },
];

const images = {};
const items = {};
let ok = 0, miss = 0;

async function emit(catSlug, name, srcPath) {
  if (!fs.existsSync(srcPath)) { console.log("EKSİK:", srcPath.replace(SRC + path.sep, "")); miss++; return; }
  const dir = path.join(OUT, catSlug);
  fs.mkdirSync(dir, { recursive: true });
  const base = slug(name);
  const tOut = path.join(dir, base + "-t.webp");
  const bOut = path.join(dir, base + "-b.webp");
  await sharp(srcPath).rotate().resize({ width: 220, height: 220, fit: "cover" }).webp({ quality: 68 }).toFile(tOut);
  await sharp(srcPath).rotate().resize({ width: 1100, height: 1100, fit: "inside", withoutEnlargement: true }).webp({ quality: 80 }).toFile(bOut);
  (images[catSlug] ||= {})[name] = { t: `images/menu/${catSlug}/${base}-t.webp`, b: `images/menu/${catSlug}/${base}-b.webp` };
  (items[catSlug] ||= []).push(name);
  ok++;
}

for (const f of FOLDERS) {
  images[f.slug] = {};
  items[f.slug] = [];

  if (f.dir === "__serpme__") {
    for (const s of SERPME) await emit(f.slug, s.name, path.join(SRC, s.file));
    continue;
  }

  const abs = path.join(SRC, f.dir);
  const files = fs.readdirSync(abs).filter((x) => /\.jpe?g$/i.test(x)).sort((a, b) => a.localeCompare(b, "tr"));
  const seen = new Set();
  for (const file of files) {
    const name = cleanName(file.replace(/\.jpe?g$/i, ""));
    if (seen.has(name)) continue;             // "Reçel (2)" tekrarını at
    seen.add(name);
    await emit(f.slug, name, path.join(abs, file));
  }
}

fs.writeFileSync(path.resolve("_scripts/menu-images.json"), JSON.stringify(images, null, 2), "utf8");
fs.writeFileSync(path.resolve("_scripts/menu-items.json"), JSON.stringify(items, null, 2), "utf8");
console.log(`\nbitti: ${ok} ürün görseli, ${miss} eksik.`);
for (const f of FOLDERS) console.log(`  ${f.slug.padEnd(12)} ${items[f.slug].length} ürün`);

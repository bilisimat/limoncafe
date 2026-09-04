/* Mevcut statik menü içeriğini (10 kategori sayfası + i18n.js sözlükleri)
   parse edip tek bir seed JSON'u üretir: scripts/menu-seed.json
   Bu dosya sadece BİR KEZ, migration için kullanılır. */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");

function readI18nData() {
  const src = fs.readFileSync(path.join(ROOT, "js/i18n.js"), "utf8");
  var mText = src.match(/var TEXT = (\{[\s\S]*?\n  \});/);
  var mCat = src.match(/var CAT = (\{[\s\S]*?\n  \});[\s\S]*?Object\.keys\(CAT\)/);
  var mItem = src.match(/var ITEM = (\{[\s\S]*?\n  \});/);
  if (!mCat || !mItem) throw new Error("CAT/ITEM i18n.js içinde bulunamadı");
  var sandbox = {};
  vm.createContext(sandbox);
  var CAT = vm.runInContext("(" + mCat[1] + ")", sandbox);
  var ITEM = vm.runInContext("(" + mItem[1] + ")", sandbox);
  // i18n.js'teki "blurb: {same:true}" son-işleme mantığını burada da uygula
  Object.keys(CAT).forEach(function (k) {
    if (CAT[k].blurb && CAT[k].blurb.same) CAT[k].blurb = CAT[k].listDesc;
  });
  return { CAT: CAT, ITEM: ITEM };
}

function attrVal(tag, attr) {
  var m = tag.match(new RegExp(attr + '="([^"]*)"'));
  return m ? m[1].replace(/&amp;/g, "&").replace(/&#39;/g, "'") : "";
}

function parseCategories(catData) {
  var html = fs.readFileSync(path.join(ROOT, "menu.html"), "utf8");
  var cardRe = /<a class="cat-card" href="(menu-[a-z]+\.html)">([\s\S]*?)<\/a>/g;
  var cats = [];
  var order = 0;
  var m;
  while ((m = cardRe.exec(html))) {
    var href = m[1];
    var block = m[2];
    var slug = href.replace(/^menu-/, "").replace(/\.html$/, "");
    var imgMatch = block.match(/src="(images\/cat\/[^"]+)"/);
    var nameMatch = block.match(/<span class="cat-name">([^<]+)</);
    var trName = nameMatch ? nameMatch[1].replace(/&amp;/g, "&").trim() : "";
    var c = catData.CAT[trName];
    if (!c) {
      console.error("UYARI: kategori sözlükte yok ->", trName);
    }
    cats.push({
      slug: slug,
      order: order++,
      href: href,
      image: imgMatch ? imgMatch[1] : "",
      name: {
        tr: trName,
        en: c ? c.name.en : trName,
        de: c ? c.name.de : trName,
        ar: c ? c.name.ar : trName,
      },
      listDesc: {
        tr: c ? c.listDesc.tr : "",
        en: c ? c.listDesc.en : "",
        de: c ? c.listDesc.de : "",
        ar: c ? c.listDesc.ar : "",
      },
      blurb: {
        tr: c ? c.blurb.tr : "",
        en: c ? c.blurb.en : "",
        de: c ? c.blurb.de : "",
        ar: c ? c.blurb.ar : "",
      },
    });
  }
  return cats;
}

function parseItemsForCategory(slug, itemData) {
  var file = path.join(ROOT, "menu-" + slug + ".html");
  var html = fs.readFileSync(file, "utf8");
  var liRe = /<li><button class="mi"[^>]*data-name="([^"]*)"[^>]*data-price="([^"]*)"[^>]*data-cat="([^"]*)"[^>]*data-img="([^"]*)"[^>]*data-desc="([^"]*)"[^>]*>\s*<img class="mi-thumb" src="([^"]*)"/g;
  var items = [];
  var order = 0;
  var m;
  while ((m = liRe.exec(html))) {
    var trName = m[1].replace(/&amp;/g, "&").replace(/&#39;/g, "'");
    var price = m[2];
    var imgBig = m[4];
    var trDesc = m[5].replace(/&amp;/g, "&").replace(/&#39;/g, "'");
    var imgThumb = m[6];
    var it = itemData.ITEM[trName];
    if (!it) console.error("UYARI: ürün sözlükte yok ->", trName, "(" + slug + ")");
    items.push({
      categorySlug: slug,
      order: order++,
      price: price,
      img: imgBig,
      imgThumb: imgThumb,
      name: {
        tr: trName,
        en: it ? it.en.n : trName,
        de: it ? it.de.n : trName,
        ar: it ? it.ar.n : trName,
      },
      desc: {
        tr: trDesc,
        en: it ? it.en.d : trDesc,
        de: it ? it.de.d : trDesc,
        ar: it ? it.ar.d : trDesc,
      },
    });
  }
  return items;
}

var data = readI18nData();
var categories = parseCategories(data);
var items = [];
categories.forEach(function (c) {
  items = items.concat(parseItemsForCategory(c.slug, data));
});

var out = { categories: categories, items: items };
fs.writeFileSync(path.join(__dirname, "menu-seed.json"), JSON.stringify(out, null, 2), "utf8");
console.log("Kategori:", categories.length, "| Ürün:", items.length);
console.log("-> scripts/menu-seed.json yazıldı");

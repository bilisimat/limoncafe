/* menu.html + menu-<slug>.html dosyalarını statikten DB-beslemeli
   (dinamik) hale getirir. Tek seferlik dönüştürme scripti. */
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");

function readSeed() {
  return JSON.parse(fs.readFileSync(path.join(__dirname, "menu-seed.json"), "utf8"));
}

function addMenuRenderScript(html) {
  if (html.indexOf("menu-render.js") > -1) return html;
  return html.replace(
    /(\s*)<script src="js\/i18n\.js\?v=1" defer><\/script>/,
    '$1<script src="js/i18n.js?v=1" defer></script>$1<script src="js/menu-render.js?v=1" defer></script>'
  );
}

/* ---------- menu.html ---------- */
function transformMenuIndex() {
  const file = path.join(ROOT, "menu.html");
  let html = fs.readFileSync(file, "utf8");

  html = html.replace(
    /<div class="cat-list">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/,
    '<div class="cat-list" id="cat-list"></div>\n      </div>\n    </section>'
  );

  html = addMenuRenderScript(html);
  fs.writeFileSync(file, html, "utf8");
  console.log("menu.html dönüştürüldü");
}

/* ---------- menu-<slug>.html ---------- */
function transformCategoryPage(slug) {
  const file = path.join(ROOT, "menu-" + slug + ".html");
  let html = fs.readFileSync(file, "utf8");

  // body'ye data-category ekle
  html = html.replace(
    /<body class="menu-page cat-page">/,
    '<body class="menu-page cat-page" data-category="' + slug + '">'
  );

  // breadcrumb
  html = html.replace(
    /<p class="sec-index sec-index--light">Menü · \d\d \/ 10<\/p>/,
    '<p class="sec-index sec-index--light" id="cat-breadcrumb"></p>'
  );

  // h1 (Pişiler'deki <small> dahil, içi boşalt)
  html = html.replace(
    /<h1 class="display display--light" id="cat-baslik">[\s\S]*?<\/h1>/,
    '<h1 class="display display--light" id="cat-baslik"></h1>'
  );

  // blurb
  html = html.replace(
    /<p class="sec-sub sec-sub--light cat-blurb">[\s\S]*?<\/p>/,
    '<p class="sec-sub sec-sub--light cat-blurb" id="cat-blurb"></p>'
  );

  // sidebar linkleri
  html = html.replace(
    /(<p class="cat-side-label">Kategoriler<\/p>\s*)([\s\S]*?)(\s*<\/aside>)/,
    '$1<div id="cat-side-links"></div>$3'
  );

  // ürün listesi
  html = html.replace(
    /<ul class="menu-list mi-list">[\s\S]*?<\/ul>/,
    '<ul class="menu-list mi-list" id="mi-list"></ul>'
  );

  // prevnext
  html = html.replace(
    /<nav class="cat-prevnext" aria-label="Kategoriler arası gezinme">[\s\S]*?<\/nav>/,
    '<nav class="cat-prevnext" id="cat-prevnext" aria-label="Kategoriler arası gezinme"></nav>'
  );

  html = addMenuRenderScript(html);
  fs.writeFileSync(file, html, "utf8");
  console.log("menu-" + slug + ".html dönüştürüldü");
}

const seed = readSeed();
transformMenuIndex();
seed.categories.forEach(function (c) { transformCategoryPage(c.slug); });

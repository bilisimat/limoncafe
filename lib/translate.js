/* Ücretsiz, key gerektirmeyen çeviri: MyMemory Translation API
   (https://mymemory.translated.net). Anonim kullanımda günlük ~5000
   kelime sınırı vardır — menü düzenleme hacmi için fazlasıyla yeterli. */

const TARGET_LANGS = ["en", "de", "ar"];

async function translateText(text, targetLang) {
  var t = (text || "").trim();
  if (!t) return "";
  var url =
    "https://api.mymemory.translated.net/get?q=" +
    encodeURIComponent(t) +
    "&langpair=tr|" +
    targetLang;
  var res = await fetch(url);
  if (!res.ok) throw new Error("Çeviri servisi hata döndü (" + res.status + ")");
  var data = await res.json();
  if (!data || !data.responseData || typeof data.responseData.translatedText !== "string") {
    throw new Error("Çeviri servisinden geçersiz yanıt");
  }
  return data.responseData.translatedText;
}

/**
 * Türkçe ad + açıklamayı EN/DE/AR'a çevirir.
 * @param {{name: string, desc: string}} tr
 * @returns {Promise<{en:{name,desc}, de:{name,desc}, ar:{name,desc}}>}
 */
async function translateItem(tr) {
  var out = {};
  for (var i = 0; i < TARGET_LANGS.length; i++) {
    var lang = TARGET_LANGS[i];
    out[lang] = {
      name: await translateText(tr.name, lang),
      desc: await translateText(tr.desc || "", lang),
    };
  }
  return out;
}

/**
 * Kategori adı + açıklama (liste + blurb) çevirisi.
 * @param {{name:string, listDesc:string, blurb:string}} tr
 */
async function translateCategory(tr) {
  var out = {};
  for (var i = 0; i < TARGET_LANGS.length; i++) {
    var lang = TARGET_LANGS[i];
    out[lang] = {
      name: await translateText(tr.name, lang),
      listDesc: await translateText(tr.listDesc || "", lang),
      blurb: await translateText(tr.blurb || tr.listDesc || "", lang),
    };
  }
  return out;
}

module.exports = { translateItem, translateCategory };

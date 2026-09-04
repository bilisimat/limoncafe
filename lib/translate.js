const Anthropic = require("@anthropic-ai/sdk");

let client = null;
function getClient() {
  if (!client) {
    if (!process.env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY tanımlı değil.");
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

/**
 * Türkçe ad + açıklamayı EN/DE/AR'a çevirir.
 * @param {{name: string, desc: string}} tr
 * @returns {Promise<{en:{name,desc}, de:{name,desc}, ar:{name,desc}}>}
 */
async function translateItem(tr) {
  var prompt =
    "Aşağıdaki Türk kahvaltı restoranı menü ürününü İngilizce, Almanca ve Arapçaya çevir.\n" +
    "Kısa, profesyonel, menü diline uygun çevir (Türkçe yemek terimlerini -menemen, kaşar, sucuk, kavurma, pişi, gözleme, sahanda- gerektiğinde olduğu gibi bırakıp açıklayıcı bir sıfat ekleyebilirsin).\n" +
    "SADECE şu JSON şemasıyla yanıt ver, başka hiçbir şey yazma:\n" +
    '{"en":{"name":"...","desc":"..."},"de":{"name":"...","desc":"..."},"ar":{"name":"...","desc":"..."}}\n\n' +
    "Ad: " + tr.name + "\n" +
    "Açıklama: " + (tr.desc || "");

  var res = await getClient().messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 600,
    messages: [{ role: "user", content: prompt }],
  });

  var text = (res.content || []).map(function (b) { return b.text || ""; }).join("").trim();
  var jsonStr = text;
  var m = text.match(/\{[\s\S]*\}/);
  if (m) jsonStr = m[0];
  var parsed = JSON.parse(jsonStr);
  return parsed;
}

/**
 * Kategori adı + açıklama (liste + blurb) çevirisi.
 * @param {{name:string, listDesc:string, blurb:string}} tr
 */
async function translateCategory(tr) {
  var prompt =
    "Aşağıdaki Türk kahvaltı restoranı menü kategorisini İngilizce, Almanca ve Arapçaya çevir.\n" +
    "Kısa, profesyonel, menü diline uygun çevir.\n" +
    "SADECE şu JSON şemasıyla yanıt ver, başka hiçbir şey yazma:\n" +
    '{"en":{"name":"...","listDesc":"...","blurb":"..."},"de":{"name":"...","listDesc":"...","blurb":"..."},"ar":{"name":"...","listDesc":"...","blurb":"..."}}\n\n' +
    "Kategori adı: " + tr.name + "\n" +
    "Liste açıklaması (kısa): " + (tr.listDesc || "") + "\n" +
    "Sayfa üstü açıklama (blurb): " + (tr.blurb || "");

  var res = await getClient().messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 700,
    messages: [{ role: "user", content: prompt }],
  });

  var text = (res.content || []).map(function (b) { return b.text || ""; }).join("").trim();
  var jsonStr = text;
  var m = text.match(/\{[\s\S]*\}/);
  if (m) jsonStr = m[0];
  return JSON.parse(jsonStr);
}

module.exports = { translateItem, translateCategory };

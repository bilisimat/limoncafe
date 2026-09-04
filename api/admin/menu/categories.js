const { getDb } = require("../../../lib/db");
const { requireAuth } = require("../../../lib/auth");
const { translateCategory } = require("../../../lib/translate");

function slugify(s) {
  var map = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", Ç: "c", Ğ: "g", İ: "i", Ö: "o", Ş: "s", Ü: "u" };
  return String(s)
    .split("")
    .map((ch) => map[ch] || ch)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

module.exports = async (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;

  try {
    const db = await getDb();
    const col = db.collection("categories");

    if (req.method === "GET") {
      const list = await col.find({}).sort({ order: 1 }).toArray();
      res.status(200).json({ categories: list.map((c) => Object.assign({}, c, { _id: String(c._id) })) });
      return;
    }

    if (req.method === "POST") {
      const { name, listDesc, blurb, image } = req.body || {};
      if (!name) {
        res.status(400).json({ error: "name (Türkçe) gerekli." });
        return;
      }
      let translated;
      try {
        translated = await translateCategory({ name, listDesc: listDesc || "", blurb: blurb || listDesc || "" });
      } catch (e) {
        res.status(502).json({ error: "Çeviri servisine ulaşılamadı, tekrar deneyin.", detail: String(e.message || e) });
        return;
      }

      const slug = slugify(name);
      const already = await col.findOne({ slug });
      if (already) {
        res.status(409).json({ error: "Bu isimden bir kategori (slug: " + slug + ") zaten var." });
        return;
      }
      const maxOrderDoc = await col.find({}).sort({ order: -1 }).limit(1).toArray();
      const order = maxOrderDoc.length ? maxOrderDoc[0].order + 1 : 0;

      const doc = {
        slug,
        order,
        image: image || "",
        name: { tr: name, en: translated.en.name, de: translated.de.name, ar: translated.ar.name },
        listDesc: {
          tr: listDesc || "",
          en: translated.en.listDesc,
          de: translated.de.listDesc,
          ar: translated.ar.listDesc,
        },
        blurb: {
          tr: blurb || listDesc || "",
          en: translated.en.blurb,
          de: translated.de.blurb,
          ar: translated.ar.blurb,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await col.insertOne(doc);
      res.status(201).json({ ok: true, id: String(result.insertedId), slug });
      return;
    }

    res.status(405).json({ error: "Desteklenmeyen metod." });
  } catch (err) {
    res.status(500).json({ error: "Sunucu hatası", detail: String(err.message || err) });
  }
};

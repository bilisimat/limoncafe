const { getDb } = require("../../../lib/db");
const { requireAuth } = require("../../../lib/auth");
const { translateItem } = require("../../../lib/translate");

module.exports = async (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;

  try {
    const db = await getDb();
    const col = db.collection("items");

    if (req.method === "GET") {
      const filter = {};
      if (req.query && req.query.category) filter.categorySlug = req.query.category;
      const list = await col.find(filter).sort({ order: 1 }).toArray();
      res.status(200).json({ items: list.map((i) => Object.assign({}, i, { _id: String(i._id) })) });
      return;
    }

    if (req.method === "POST") {
      const { categorySlug, name, desc, price, img, imgThumb } = req.body || {};
      if (!categorySlug || !name) {
        res.status(400).json({ error: "categorySlug ve name (Türkçe) gerekli." });
        return;
      }
      const catExists = await db.collection("categories").findOne({ slug: categorySlug });
      if (!catExists) {
        res.status(400).json({ error: "Geçersiz categorySlug." });
        return;
      }

      let translated;
      try {
        translated = await translateItem({ name, desc: desc || "" });
      } catch (e) {
        res.status(502).json({ error: "Çeviri servisine ulaşılamadı, tekrar deneyin.", detail: String(e.message || e) });
        return;
      }

      const maxOrderDoc = await col.find({ categorySlug }).sort({ order: -1 }).limit(1).toArray();
      const order = maxOrderDoc.length ? maxOrderDoc[0].order + 1 : 0;

      const doc = {
        categorySlug,
        order,
        price: price || "",
        img: img || "",
        imgThumb: imgThumb || img || "",
        name: { tr: name, en: translated.en.name, de: translated.de.name, ar: translated.ar.name },
        desc: { tr: desc || "", en: translated.en.desc, de: translated.de.desc, ar: translated.ar.desc },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await col.insertOne(doc);
      res.status(201).json({ ok: true, id: String(result.insertedId) });
      return;
    }

    res.status(405).json({ error: "Desteklenmeyen metod." });
  } catch (err) {
    res.status(500).json({ error: "Sunucu hatası", detail: String(err.message || err) });
  }
};

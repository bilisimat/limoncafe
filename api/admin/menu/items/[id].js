const { ObjectId } = require("mongodb");
const { getDb } = require("../../../../lib/db");
const { requireAuth } = require("../../../../lib/auth");
const { translateItem } = require("../../../../lib/translate");

module.exports = async (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;

  const id = req.query && req.query.id;
  if (!id) {
    res.status(400).json({ error: "id gerekli." });
    return;
  }

  try {
    const db = await getDb();
    const col = db.collection("items");
    const _id = new ObjectId(String(id));

    if (req.method === "PUT") {
      const { name, desc, price, img, imgThumb, categorySlug, order } = req.body || {};
      const current = await col.findOne({ _id });
      if (!current) {
        res.status(404).json({ error: "Ürün bulunamadı." });
        return;
      }

      const update = { updatedAt: new Date() };
      if (typeof price === "string") update.price = price;
      if (typeof img === "string") update.img = img;
      if (typeof imgThumb === "string") update.imgThumb = imgThumb;
      if (typeof categorySlug === "string") update.categorySlug = categorySlug;
      if (typeof order === "number") update.order = order;

      if (name || desc != null) {
        let translated;
        try {
          translated = await translateItem({
            name: name || current.name.tr,
            desc: desc != null ? desc : current.desc.tr,
          });
        } catch (e) {
          console.error("çeviri hatası:", e);
          res.status(502).json({ error: "Çeviri servisine ulaşılamadı, tekrar deneyin." });
          return;
        }
        update.name = { tr: name || current.name.tr, en: translated.en.name, de: translated.de.name, ar: translated.ar.name };
        update.desc = {
          tr: desc != null ? desc : current.desc.tr,
          en: translated.en.desc,
          de: translated.de.desc,
          ar: translated.ar.desc,
        };
      }

      await col.updateOne({ _id }, { $set: update });
      res.status(200).json({ ok: true });
      return;
    }

    if (req.method === "DELETE") {
      const result = await col.deleteOne({ _id });
      if (result.deletedCount === 0) {
        res.status(404).json({ error: "Ürün bulunamadı." });
        return;
      }
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ error: "Desteklenmeyen metod." });
  } catch (err) {
    console.error("menu/items/[id] hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

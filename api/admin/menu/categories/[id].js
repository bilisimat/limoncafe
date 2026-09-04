const { ObjectId } = require("mongodb");
const { getDb } = require("../../../../lib/db");
const { requireAuth } = require("../../../../lib/auth");
const { translateCategory } = require("../../../../lib/translate");

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
    const col = db.collection("categories");
    const _id = new ObjectId(String(id));

    if (req.method === "PUT") {
      const { name, listDesc, blurb, image, order } = req.body || {};
      const current = await col.findOne({ _id });
      if (!current) {
        res.status(404).json({ error: "Kategori bulunamadı." });
        return;
      }

      const update = { updatedAt: new Date() };
      if (typeof image === "string") update.image = image;
      if (typeof order === "number") update.order = order;

      if (name || listDesc || blurb) {
        let translated;
        try {
          translated = await translateCategory({
            name: name || current.name.tr,
            listDesc: listDesc != null ? listDesc : current.listDesc.tr,
            blurb: blurb != null ? blurb : current.blurb.tr,
          });
        } catch (e) {
          res.status(502).json({ error: "Çeviri servisine ulaşılamadı, tekrar deneyin.", detail: String(e.message || e) });
          return;
        }
        update.name = { tr: name || current.name.tr, en: translated.en.name, de: translated.de.name, ar: translated.ar.name };
        update.listDesc = {
          tr: listDesc != null ? listDesc : current.listDesc.tr,
          en: translated.en.listDesc,
          de: translated.de.listDesc,
          ar: translated.ar.listDesc,
        };
        update.blurb = {
          tr: blurb != null ? blurb : current.blurb.tr,
          en: translated.en.blurb,
          de: translated.de.blurb,
          ar: translated.ar.blurb,
        };
      }

      await col.updateOne({ _id }, { $set: update });
      res.status(200).json({ ok: true });
      return;
    }

    if (req.method === "DELETE") {
      const current = await col.findOne({ _id });
      if (!current) {
        res.status(404).json({ error: "Kategori bulunamadı." });
        return;
      }
      const itemsCol = db.collection("items");
      const itemCount = await itemsCol.countDocuments({ categorySlug: current.slug });
      await itemsCol.deleteMany({ categorySlug: current.slug });
      await col.deleteOne({ _id });
      res.status(200).json({ ok: true, deletedItems: itemCount });
      return;
    }

    res.status(405).json({ error: "Desteklenmeyen metod." });
  } catch (err) {
    res.status(500).json({ error: "Sunucu hatası", detail: String(err.message || err) });
  }
};

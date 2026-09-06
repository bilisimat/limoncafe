const { ObjectId } = require("mongodb");
const { getDb } = require("../../../../lib/db");
const { requireAuth } = require("../../../../lib/auth");

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
      // Panelden fiyat her zaman güncellenebilir. İsim güncellemesi yalnızca
      // zaten var olan bir "name" objesi (tr/en/de/ar) gönderildiğinde kabul
      // edilir — yeni çeviri tetiklemez, sadece verilen değerleri olduğu gibi
      // yazar (yanlışlıkla yeniden çeviri/çeviri bozulması riskini önler).
      const { price, name } = req.body || {};
      if (typeof price !== "string") {
        res.status(400).json({ error: "price (metin) gerekli." });
        return;
      }
      if (name !== undefined && (typeof name !== "object" || name === null || Array.isArray(name))) {
        res.status(400).json({ error: "name obje olmalı." });
        return;
      }
      const current = await col.findOne({ _id });
      if (!current) {
        res.status(404).json({ error: "Ürün bulunamadı." });
        return;
      }

      const set = { price, updatedAt: new Date() };
      if (name !== undefined) set.name = name;
      await col.updateOne({ _id }, { $set: set });
      res.status(200).json({ ok: true });
      return;
    }

    if (req.method === "DELETE") {
      // Ürün silme panelden kaldırıldı.
      res.status(403).json({ error: "Ürün silme devre dışı." });
      return;
    }

    res.status(405).json({ error: "Desteklenmeyen metod." });
  } catch (err) {
    console.error("menu/items/[id] hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

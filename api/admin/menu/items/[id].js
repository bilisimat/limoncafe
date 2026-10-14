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
      // Panelden yalnızca fiyat güncellenebilir — ürün adı/açıklama/görsel/
      // kategori artık bu uçtan değiştirilemez (yanlışlıkla yeniden çeviri
      // tetiklenip mevcut çevirilerin bozulmasını önlemek için).
      // GEÇİCİ: sıra (order) değişikliği için 'order' alanı da kabul ediliyor.
      const { price, order } = req.body || {};
      const set = { updatedAt: new Date() };
      if (typeof price === "string") set.price = price;
      if (typeof order === "number" && Number.isFinite(order)) set.order = order;
      if (set.price === undefined && set.order === undefined) {
        res.status(400).json({ error: "price (metin) veya order (sayı) gerekli." });
        return;
      }
      const current = await col.findOne({ _id });
      if (!current) {
        res.status(404).json({ error: "Ürün bulunamadı." });
        return;
      }

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

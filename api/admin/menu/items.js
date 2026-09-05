const { getDb } = require("../../../lib/db");
const { requireAuth } = require("../../../lib/auth");

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
      // Ürün ekleme panelden kaldırıldı — menü yapısı (ürün adı/açıklama/görsel)
      // sadece doğrudan veritabanı üzerinden değiştirilebilir. Panelde yalnızca
      // mevcut ürünlerin fiyatı düzenlenebilir.
      res.status(403).json({ error: "Ürün ekleme devre dışı. Panelden yalnızca fiyat güncellenebilir." });
      return;
    }

    res.status(405).json({ error: "Desteklenmeyen metod." });
  } catch (err) {
    console.error("menu/items hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

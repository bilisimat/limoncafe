const { getDb } = require("../../../lib/db");
const { requireAuth } = require("../../../lib/auth");

// Tek seferlik: mevcut statik menüyü DB'ye aktarır. Koleksiyonlar boş değilse çalışmaz.
module.exports = async (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  if (req.method !== "POST") {
    res.status(405).json({ error: "Yalnızca POST." });
    return;
  }

  try {
    const db = await getDb();
    const catsCol = db.collection("categories");
    const itemsCol = db.collection("items");

    const existingCats = await catsCol.countDocuments();
    const existingItems = await itemsCol.countDocuments();
    if (existingCats > 0 || existingItems > 0) {
      res.status(409).json({ error: "Menü koleksiyonları zaten dolu. Import tekrar çalıştırılamaz." });
      return;
    }

    const { categories, items } = req.body || {};
    if (!Array.isArray(categories) || !Array.isArray(items)) {
      res.status(400).json({ error: "categories ve items dizileri gerekli." });
      return;
    }

    const now = new Date();
    const catsWithMeta = categories.map((c) => Object.assign({}, c, { createdAt: now, updatedAt: now }));
    const itemsWithMeta = items.map((i) => Object.assign({}, i, { createdAt: now, updatedAt: now }));

    if (catsWithMeta.length) await catsCol.insertMany(catsWithMeta);
    if (itemsWithMeta.length) await itemsCol.insertMany(itemsWithMeta);

    res.status(200).json({ ok: true, categories: catsWithMeta.length, items: itemsWithMeta.length });
  } catch (err) {
    res.status(500).json({ error: "Sunucu hatası", detail: String(err.message || err) });
  }
};

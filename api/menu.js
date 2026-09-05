const { getDb } = require("../lib/db");

// Herkese açık: menü sayfaları bu uçtan tüm kategori + ürünleri çeker.
module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Yalnızca GET." });
    return;
  }
  try {
    const db = await getDb();
    const categories = await db.collection("categories").find({}).sort({ order: 1 }).toArray();
    const items = await db.collection("items").find({}).sort({ order: 1 }).toArray();

    const mapId = (doc) => Object.assign({}, doc, { _id: String(doc._id) });

    res.setHeader("Cache-Control", "public, max-age=30, stale-while-revalidate=120");
    res.status(200).json({
      categories: categories.map(mapId),
      items: items.map(mapId),
    });
  } catch (err) {
    console.error("menu hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

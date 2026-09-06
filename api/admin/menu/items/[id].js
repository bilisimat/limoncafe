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
      // Panelden fiyat her zaman güncellenebilir. name/desc yalnızca zaten
      // hazır (tr/en/de/ar) obje olarak gönderildiğinde kabul edilir — yeni
      // çeviri tetiklemez, verilen değerleri olduğu gibi yazar. Çeviri
      // denetiminde tespit edilen hataları düzeltmek için geçici olarak
      // açıldı; kullanım sonrası kaldırılacak.
      const { price, name, desc } = req.body || {};
      if (typeof price !== "string") {
        res.status(400).json({ error: "price (metin) gerekli." });
        return;
      }
      const isLangObj = (v) => v !== undefined && typeof v === "object" && v !== null && !Array.isArray(v);
      if (name !== undefined && !isLangObj(name)) {
        res.status(400).json({ error: "name obje olmalı." });
        return;
      }
      if (desc !== undefined && !isLangObj(desc)) {
        res.status(400).json({ error: "desc obje olmalı." });
        return;
      }
      const current = await col.findOne({ _id });
      if (!current) {
        res.status(404).json({ error: "Ürün bulunamadı." });
        return;
      }

      const set = { price, updatedAt: new Date() };
      if (name !== undefined) set.name = name;
      if (desc !== undefined) set.desc = desc;
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

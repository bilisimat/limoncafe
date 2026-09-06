const { ObjectId } = require("mongodb");
const { getDb } = require("../../../lib/db");
const { requireAuth } = require("../../../lib/auth");

// GEÇİCİ, tek kullanımlık uç: "Limos Serpme Kahvaltı" ve "Special Serpme
// Kahvaltı" ürünlerinin YALNIZCA name alanlarını (tüm diller) takas eder;
// price/desc/img/order dokunulmaz. Panelin tüm diğer uçlarıyla aynı
// requireAuth koruması kullanılır — yeni bir yetkilendirme yolu açmaz.
// Kullanımdan hemen sonra bu dosya silinip yeniden deploy edilecek.
const ID_A = "6a9b25db5a695562d35c0e3a"; // şu an "Limos Serpme Kahvaltı"
const ID_B = "6a9b25db5a695562d35c0e3c"; // şu an "Special Serpme Kahvaltı"

module.exports = async (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  if (req.method !== "POST") {
    res.status(405).json({ error: "Yalnızca POST." });
    return;
  }
  try {
    const db = await getDb();
    const col = db.collection("items");
    const a = await col.findOne({ _id: new ObjectId(ID_A) });
    const b = await col.findOne({ _id: new ObjectId(ID_B) });
    if (!a || !b) {
      res.status(404).json({ error: "items not found", a: !!a, b: !!b });
      return;
    }
    await col.updateOne({ _id: a._id }, { $set: { name: b.name, updatedAt: new Date() } });
    await col.updateOne({ _id: b._id }, { $set: { name: a.name, updatedAt: new Date() } });
    res.status(200).json({ ok: true, aNowNamed: b.name, bNowNamed: a.name });
  } catch (err) {
    console.error("swap-serpme-names hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

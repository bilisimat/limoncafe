const { getDb } = require("../lib/db");
const { hashPassword } = require("../lib/auth");

// Tek seferlik ilk admin oluşturma ucu. 'admins' koleksiyonu boşsa çalışır,
// bir admin oluşturulduktan sonra kalıcı olarak kendini kapatır (409).
module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Yalnızca POST." });
    return;
  }
  const key = req.headers["x-setup-key"];
  if (!key || key !== process.env.SESSION_SECRET) {
    res.status(401).json({ error: "Yetkisiz." });
    return;
  }

  try {
    const db = await getDb();
    const admins = db.collection("admins");
    const existing = await admins.countDocuments();
    if (existing > 0) {
      res.status(409).json({ error: "Kurulum zaten tamamlanmış. Bu uç artık devre dışı." });
      return;
    }

    const { username, password } = req.body || {};
    if (!username || !password || String(password).length < 8) {
      res.status(400).json({ error: "username ve en az 8 karakterli password gerekli." });
      return;
    }

    const passwordHash = await hashPassword(String(password));
    await admins.insertOne({
      username: String(username).trim(),
      passwordHash,
      createdAt: new Date(),
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("setup hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

const { ObjectId } = require("mongodb");
const { getDb } = require("../../lib/db");
const { requireAuth, hashPassword } = require("../../lib/auth");

module.exports = async (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;

  try {
    const db = await getDb();
    const admins = db.collection("admins");

    if (req.method === "GET") {
      const list = await admins
        .find({}, { projection: { passwordHash: 0 } })
        .sort({ createdAt: 1 })
        .toArray();
      res.status(200).json({ admins: list });
      return;
    }

    if (req.method === "POST") {
      const { username, password } = req.body || {};
      if (!username || !password || String(password).length < 8) {
        res.status(400).json({ error: "Kullanıcı adı ve en az 8 karakterli şifre gerekli." });
        return;
      }
      const uname = String(username).trim();
      const already = await admins.findOne({ username: uname });
      if (already) {
        res.status(409).json({ error: "Bu kullanıcı adı zaten var." });
        return;
      }
      const passwordHash = await hashPassword(String(password));
      const result = await admins.insertOne({ username: uname, passwordHash, createdAt: new Date() });
      res.status(201).json({ ok: true, id: result.insertedId });
      return;
    }

    if (req.method === "PUT") {
      const { id, password } = req.body || {};
      if (!id || !password || String(password).length < 8) {
        res.status(400).json({ error: "id ve en az 8 karakterli password gerekli." });
        return;
      }
      const passwordHash = await hashPassword(String(password));
      const result = await admins.updateOne({ _id: new ObjectId(String(id)) }, { $set: { passwordHash } });
      if (result.matchedCount === 0) {
        res.status(404).json({ error: "Admin bulunamadı." });
        return;
      }
      res.status(200).json({ ok: true });
      return;
    }

    if (req.method === "DELETE") {
      const { id } = req.body || {};
      if (!id) {
        res.status(400).json({ error: "id gerekli." });
        return;
      }
      const total = await admins.countDocuments();
      if (total <= 1) {
        res.status(400).json({ error: "Son admin silinemez." });
        return;
      }
      await admins.deleteOne({ _id: new ObjectId(String(id)) });
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ error: "Desteklenmeyen metod." });
  } catch (err) {
    res.status(500).json({ error: "Sunucu hatası", detail: String(err.message || err) });
  }
};

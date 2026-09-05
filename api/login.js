const { getDb } = require("../lib/db");
const { verifyPassword, setSessionCookie } = require("../lib/auth");

const WINDOW_SECONDS = 15 * 60;
const MAX_ATTEMPTS = 8;
const MAX_ATTEMPTS_PER_IP = 20; // farklı kullanıcı adlarıyla deneyerek hesap-bazlı sınırı aşmayı önler

function clientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  if (fwd) return String(fwd).split(",")[0].trim();
  return req.socket && req.socket.remoteAddress ? req.socket.remoteAddress : "unknown";
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Yalnızca POST." });
    return;
  }

  const { username, password } = req.body || {};
  if (!username || !password) {
    res.status(400).json({ error: "Kullanıcı adı ve şifre gerekli." });
    return;
  }

  try {
    const db = await getDb();
    const attempts = db.collection("login_attempts");
    await attempts.createIndex({ firstAttempt: 1 }, { expireAfterSeconds: WINDOW_SECONDS });

    const ip = clientIp(req);
    const rateKey = `${ip}:${String(username).toLowerCase()}`;
    const ipKey = `ip:${ip}`;
    const [rec, ipRec] = await Promise.all([
      attempts.findOne({ key: rateKey }),
      attempts.findOne({ key: ipKey }),
    ]);
    if ((rec && rec.count >= MAX_ATTEMPTS) || (ipRec && ipRec.count >= MAX_ATTEMPTS_PER_IP)) {
      res.status(429).json({ error: "Çok fazla deneme. Birkaç dakika sonra tekrar deneyin." });
      return;
    }

    const admins = db.collection("admins");
    const admin = await admins.findOne({ username: String(username).trim() });
    const ok = admin ? await verifyPassword(String(password), admin.passwordHash) : false;

    if (!ok) {
      await Promise.all([
        attempts.updateOne(
          { key: rateKey },
          { $inc: { count: 1 }, $setOnInsert: { firstAttempt: new Date() } },
          { upsert: true }
        ),
        attempts.updateOne(
          { key: ipKey },
          { $inc: { count: 1 }, $setOnInsert: { firstAttempt: new Date() } },
          { upsert: true }
        ),
      ]);
      res.status(401).json({ error: "Kullanıcı adı veya şifre hatalı." });
      return;
    }

    await attempts.deleteOne({ key: rateKey });
    setSessionCookie(res, admin.username);
    res.status(200).json({ ok: true, username: admin.username });
  } catch (err) {
    console.error("login hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

const QRCode = require("qrcode");
const { requireAuth } = require("../../lib/auth");

const MENU_URL = "https://www.limoskahvalti.com/menu";

module.exports = async (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;

  try {
    const target = (req.query && req.query.url) || MENU_URL;
    const buf = await QRCode.toBuffer(target, {
      type: "png",
      width: 640,
      margin: 2,
      color: { dark: "#211C18", light: "#F3EFE6" },
    });
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "no-store");
    res.status(200).send(buf);
  } catch (err) {
    console.error("qr hatası:", err);
    res.status(500).json({ error: "QR üretilemedi" });
  }
};

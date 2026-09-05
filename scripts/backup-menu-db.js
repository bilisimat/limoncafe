/* Menü veritabanının (categories, items, admins) elle çalıştırılan yedeğini
   backups/ klasörüne zaman damgalı bir JSON dosyası olarak yazar.
   admins koleksiyonunda passwordHash ASLA dışa aktarılmaz.

   Kullanım:  node scripts/backup-menu-db.js
   Gerekli:   MONGODB_URI ortam değişkeni (örn. `vercel env pull .env.local` ile alınabilir) */
const fs = require("fs");
const path = require("path");

// Küçük .env.local okuyucu (harici bağımlılık eklememek için) — zaten process.env'de
// varsa (örn. `vercel env pull` sonrası export edilmişse) dosyadaki değeri geçersiz kılmaz.
(function loadEnvLocal() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) return;
  fs.readFileSync(envPath, "utf8").split(/\r?\n/).forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) return;
    const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/i);
    if (!m) return;
    let val = m[2];
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!(m[1] in process.env)) process.env[m[1]] = val;
  });
})();

const { getDb } = require("../lib/db");

async function main() {
  const db = await getDb();

  const categories = await db.collection("categories").find({}).toArray();
  const items = await db.collection("items").find({}).toArray();
  const admins = await db
    .collection("admins")
    .find({}, { projection: { passwordHash: 0 } })
    .toArray();

  const backup = {
    takenAt: new Date().toISOString(),
    categories,
    items,
    admins,
  };

  const dir = path.join(__dirname, "..", "backups");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const stamp = backup.takenAt.replace(/[:.]/g, "-");
  const file = path.join(dir, `menu-backup-${stamp}.json`);
  fs.writeFileSync(file, JSON.stringify(backup, null, 2), "utf8");

  console.log(`Yedek yazıldı: ${file}`);
  console.log(`  Kategoriler: ${categories.length}  Ürünler: ${items.length}  Adminler: ${admins.length} (şifreler hariç)`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Yedekleme başarısız:", err);
  process.exit(1);
});

const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");

const token = "8328511745:AAGii5ZTzHWH03HVyiwiKaPhzFFH4OVdqzY"; // Ganti dengan token bot kamu
const ADMIN_ID = 7860521205;    // Ganti dengan ID kamu

const bot = new TelegramBot(token, { polling: true });

function loadDB() {
  return JSON.parse(fs.readFileSync("database.json", "utf-8"));
}
function saveDB(db) {
  fs.writeFileSync("database.json", JSON.stringify(db, null, 2));
}

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "✅ Selamat datang di *GamzHost Bot*!\nGunakan /adduser, /deluser, /listusers", { parse_mode: "Markdown" });
});

bot.onText(/\/adduser (.+)/, (msg, match) => {
  if (msg.from.id !== ADMIN_ID) return;
  const [username, pass] = match[1].split(" ");
  if (!username || !pass) return bot.sendMessage(msg.chat.id, "⚠️ Format: /adduser username password");

  const db = loadDB();
  db.users.push({ username, password: pass });
  saveDB(db);

  bot.sendMessage(msg.chat.id, `✅ Akun *${username}* ditambahkan.\n🔑 Password: *${pass}*`, { parse_mode: "Markdown" });
  bot.sendMessage(ADMIN_ID, `📥 Akun baru:\n👤 ${username}\n🔑 ${pass}`);
});

bot.onText(/\/deluser (.+)/, (msg, match) => {
  if (msg.from.id !== ADMIN_ID) return;
  const username = match[1].trim();

  const db = loadDB();
  const index = db.users.findIndex(u => u.username === username);
  if (index === -1) return bot.sendMessage(msg.chat.id, "❌ User tidak ditemukan.");

  db.users.splice(index, 1);
  saveDB(db);

  bot.sendMessage(msg.chat.id, `✅ User *${username}* dihapus.`, { parse_mode: "Markdown" });
});

bot.onText(/\/listusers/, (msg) => {
  if (msg.from.id !== ADMIN_ID) return;

  const db = loadDB();
  if (db.users.length === 0) return bot.sendMessage(msg.chat.id, "📂 Tidak ada user.");

  const list = db.users.map((u, i) => `🔹 ${i + 1}. ${u.username} / ${u.password}`).join("\n");
  bot.sendMessage(msg.chat.id, `📄 Daftar User:\n\n${list}`);
});

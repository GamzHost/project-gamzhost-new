const express = require("express");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());

// Endpoint login
app.post("/verify", (req, res) => {
  const { username, password } = req.body;
  const db = JSON.parse(fs.readFileSync("database.json", "utf-8"));
  const valid = db.users.some(u => u.username === username && u.password === password);
  res.json({ valid });
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

// Mulai bot Telegram
require("./bot.js");

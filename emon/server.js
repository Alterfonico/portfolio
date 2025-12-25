const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

// Middleware to serve static files (HTML/CSS)
app.use(express.static("public"));
app.use(express.json());

// THE DATABASE (A simple file)
const DB_FILE = "./price_db.json";

// Initialize DB if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ count: 42 })); // Start at $42
}

// 1. GET CURRENT PRICE
app.get("/api/price", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB_FILE));
  res.json({ price: data.count });
});

// 2. BUY ACTION (The i++)
app.post("/api/buy", (req, res) => {
  // In a real app, this happens INSIDE the Stripe Webhook, not here.
  // For MVP, clicking the button simulates a purchase.

  let data = JSON.parse(fs.readFileSync(DB_FILE));

  // The Magic Logic
  const paidPrice = data.count;
  data.count++; // i++

  // Save to file
  fs.writeFileSync(DB_FILE, JSON.stringify(data));

  // Return the "E-mon" Token
  res.json({
    success: true,
    nextPrice: data.count,
    token: "TOKEN_#8A_GLITCH_DEMON_V4", // This is the 'product'
  });
});

app.listen(PORT, () => {
  console.log(`The Rabbit Hole is open at http://localhost:${PORT}`);
});

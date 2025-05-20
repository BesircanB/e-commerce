
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware'ler
app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require("./routes/users");
console.log("--- index.js ---");
console.log("userRoutes tipi:", typeof userRoutes); // 'object' olmalı
console.log("userRoutes içeriği:", userRoutes);     // Router nesnesini göstermeli
if (typeof userRoutes !== 'function' && typeof userRoutes !== 'object') {
    console.error("HATA: userRoutes bir fonksiyon veya router nesnesi değil!");
}
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("E-commerce API anasayfasına hoş geldiniz!");
});

app.use((err, req, res, next) => {
  console.error("Genel Hata Yakalayıcı:", err.stack);
  res.status(500).send('Bir şeyler ters gitti!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Sunucu ${PORT} portunda çalışıyor`);
});

const productRoutes = require("./routes/products");
app.use("/api/products", productRoutes);

// index.js
const cartRoutes = require("./routes/cart");
app.use("/api/cart", cartRoutes);

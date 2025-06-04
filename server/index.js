// server/index.js

const express = require("express");
const cors    = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Supabase ve Test DB temizliği (test ortamında tabloları sıfırla)
if (process.env.NODE_ENV === "test") {
  const supabase = require("./services/supabase");
  (async () => {
    await supabase.from("orders").delete().neq("id", 0);
    await supabase.from("cart").delete().neq("id", 0);
    await supabase.from("products").delete().neq("id", 0);
    await supabase.from("users").delete().neq("id", 0);
  })();
}

// Route’lar
const authRoutes       = require("./routes/auth");
const userRoutes       = require("./routes/users");
const productRoutes    = require("./routes/products");
const cartRoutes       = require("./routes/cart");
const orderRoutes      = require("./routes/orders");
const reviewRoutes     = require("./routes/reviews"); // ✅ RESTful uyumlu hale getirildi
const adminRoutes      = require("./routes/admin");
const categoryRoutes   = require("./routes/categories");
const wishlistRoutes   = require("./routes/wishlist");
const campaignRoutes   = require("./routes/campaigns");

// RESTful API route mount işlemleri
app.use("/api/auth",       authRoutes);
app.use("/api/users",      userRoutes);
app.use("/api/products",   productRoutes);
app.use("/api/cart",       cartRoutes);
app.use("/api/orders",     orderRoutes);
app.use("/api",            reviewRoutes);     // ✅ Artık "/api/products/:id/reviews" gibi çalışır
app.use("/api/admin",      adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/wishlist",   wishlistRoutes);
app.use("/api/admin", campaignRoutes); // → /api/admin/campaigns
app.use("/api/campaigns",  campaignRoutes);


// Sağlık kontrolü
app.get("/", (req, res) => res.send("E-commerce API anasayfasına hoş geldiniz!"));

// Global hata yakalayıcı
app.use((err, req, res, next) => {
  console.error("Genel Hata Yakalayıcı:", err.stack);
  res.status(500).json({ error: "Sunucu hatası oluştu" });
});

// Sunucuyu başlat (test değilse)
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Sunucu ${PORT} portunda çalışıyor`);
  });
}

// Testler için export
module.exports = app;

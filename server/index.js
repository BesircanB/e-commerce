// server/index.js

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 🌐 ROUTES
const authRoutes       = require("./routes/auth");
const userRoutes       = require("./routes/users");
const productRoutes    = require("./routes/products");
const cartRoutes       = require("./routes/cart");
const orderRoutes      = require("./routes/orders");
const reviewRoutes     = require("./routes/reviews");
const adminRoutes      = require("./routes/admin");
const categoryRoutes   = require("./routes/categories");
const wishlistRoutes   = require("./routes/wishlist");
const campaignRoutes   = require("./routes/campaigns");

// ✅ API MOUNT
app.use("/api/auth",       authRoutes);
app.use("/api/users",      userRoutes);
app.use("/api/products",   productRoutes);
app.use("/api/cart",       cartRoutes);
app.use("/api/orders",     orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin",      adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/wishlist",   wishlistRoutes);
app.use("/api/admin",      campaignRoutes); // /api/admin/campaigns
app.use("/api/campaigns",  campaignRoutes); // public campaign sorguları

// ✅ Sağlık kontrolü
app.get("/", (req, res) => {
  res.send("E-commerce API anasayfasına hoş geldiniz!");
});

// 🧪 TEST ortamı veritabanı temizliği (isteğe bağlı)
if (process.env.NODE_ENV === "test") {
  const supabase = require("./services/supabase");
  (async () => {
    await supabase.from("orders").delete().neq("id", 0);
    await supabase.from("cart").delete().neq("id", 0);
    await supabase.from("products").delete().neq("id", 0);
    await supabase.from("users").delete().neq("id", 0);
  })();
}

// 🧯 GLOBAL ERROR HANDLER
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

// 🚀 Server başlat (test değilse)
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Sunucu ${PORT} portunda çalışıyor`);
  });
}

// ✅ Testler için app export edilir
module.exports = app;

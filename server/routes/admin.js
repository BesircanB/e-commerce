const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const checkAdmin = require("../middleware/checkAdmin");

const {
  getAdminMetrics,
  getRevenueStats,
  getMonthlyRevenue,
  getTopSelling,
  getTopWished
} = require("../controllers/adminController");

const productController = require("../controllers/productController");

// --- 📊 Admin dashboard istatistikleri
router.get("/metrics", verifyToken, checkAdmin, getAdminMetrics);

// --- 💰 Finansal veriler
router.get("/revenue", verifyToken, checkAdmin, getRevenueStats);

// --- 📈 Aylık gelir grafiği
router.get("/revenue/monthly", verifyToken, checkAdmin, getMonthlyRevenue);

// --- 🔍 Admin ürün arama (görünürlüğe bakmaz)
router.get("/products/search", verifyToken, checkAdmin, productController.searchAdminProducts);

router.get("/products/top-sellers", verifyToken, checkAdmin, getTopSelling);

router.get("/products/top-wished", verifyToken, checkAdmin, getTopWished);

module.exports = router;

// server/routes/orders.js
const express      = require("express");
const router       = express.Router();
const verifyToken  = require("../middleware/verifyToken");
const checkAdmin   = require("../middleware/checkAdmin");
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
} = require("../controllers/orderController");

// Hepsi token doğrulama gerektirir
router.use(verifyToken);

// POST   /api/orders           → Sepetten veya body’den sipariş oluştur
router.post("/", createOrder);

// GET    /api/orders           → Kendi siparişlerini listele
router.get("/", getMyOrders);

// GET    /api/orders/all       → Admin: tüm siparişleri listele
router.get("/all", checkAdmin, getAllOrders);

// GET    /api/orders/:id       → Sipariş detayını döndür
router.get("/:id", getOrderById);

// PUT    /api/orders/:id/status  → Admin: sipariş durumunu güncelle
router.put("/:id/status", checkAdmin, updateOrderStatus);

// PATCH  /api/orders/:id/cancel  → Kullanıcı veya Admin siparişi iptal etsin
router.patch("/:id/cancel", cancelOrder);

module.exports = router;

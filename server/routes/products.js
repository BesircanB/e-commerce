// server/routes/products.js

const express     = require("express");
const router      = express.Router();
const verifyToken = require("../middleware/verifyToken");
const checkAdmin  = require("../middleware/checkAdmin");

const productController = require("../controllers/productController");

const {
  getAllProducts,
  getAllProductsAdmin,
  getProductById,
  getProductByIdAdmin,
  createProduct,
  updateProduct,
  updateProductStock,
  updateProductVisibility,
  deleteProduct
} = productController;

// --- 🛡️ ADMIN ROUTES (önce yazılmalı!) ---
router.get("/admin/all", verifyToken, checkAdmin, getAllProductsAdmin);        // Tüm ürünleri getir
router.get("/admin/:id", verifyToken, checkAdmin, getProductByIdAdmin);        // Tek ürün (görünürlük fark etmeksizin)
router.put("/admin/:id/visibility", verifyToken, checkAdmin, updateProductVisibility); // ✅ görünürlük güncelleme
router.post("/", verifyToken, checkAdmin, createProduct);
router.put("/:id", verifyToken, checkAdmin, updateProduct);
router.put("/:id/stock", verifyToken, checkAdmin, updateProductStock);
router.delete("/:id", verifyToken, checkAdmin, deleteProduct);                 // Mantıksal silme

// --- 👤 PUBLIC ROUTES (en sona yazılır!) ---
router.get("/", getAllProducts);        // Sadece is_visible:true ürünler
router.get("/:id", getProductById);     // Sadece görünür ürün detayı

module.exports = router;

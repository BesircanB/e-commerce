const express     = require("express");
const router      = express.Router();
const verifyToken = require("../middleware/verifyToken");
const checkAdmin  = require("../middleware/checkAdmin");

// Controller fonksiyonlarını içe aktar
const productController = require("../controllers/productController");

// Debug: controller ve middleware tipleri
console.log("--- routes/products.js ---");
console.log("productController objesi:", productController);
console.log("typeof productController.getAllProducts:", typeof productController.getAllProducts);
console.log("typeof productController.createProduct:", typeof productController.createProduct);
console.log("typeof productController.updateProduct:", typeof productController.updateProduct);
console.log("typeof productController.deleteProduct:", typeof productController.deleteProduct);
console.log("typeof verifyToken:", typeof verifyToken);
console.log("typeof checkAdmin:", typeof checkAdmin);

// Fonksiyonları ayıklayalım, stok güncelleme için de ekledik
const {
  getAllProducts,
  createProduct,
  updateProduct,
  updateProductStock,  // Stok güncelleme endpoint'i
  deleteProduct
} = productController;

// GET /products → Tüm ürünleri listele (HERKES)
router.get("/", getAllProducts);

// POST /products → Yeni ürün oluştur (SADECE ADMIN)
router.post("/", verifyToken, checkAdmin, createProduct);

// PUT /products/:id → Ürün güncelle (SADECE ADMIN)
router.put("/:id", verifyToken, checkAdmin, updateProduct);

// PUT /products/:id/stock → Stok güncelle (SADECE ADMIN)
router.put("/:id/stock", verifyToken, checkAdmin, updateProductStock);

// DELETE /products/:id → Ürün sil (SADECE ADMIN)
router.delete("/:id", verifyToken, checkAdmin, deleteProduct);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

// Tüm ürünleri getir
router.get("/", getAllProducts);

// Yeni ürün ekle
router.post("/", createProduct);

// Ürün güncelle
router.put("/:id", updateProduct);

// Ürün sil
router.delete("/:id", deleteProduct);

module.exports = router;

const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const checkAdmin  = require("../middleware/checkAdmin");

const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

// ✅ Public: Tüm kategorileri listele
router.get("/", getAllCategories);

// ✅ Admin: Yeni kategori oluştur
router.post("/", verifyToken, checkAdmin, createCategory);

// ✅ Admin: Kategori güncelle
router.put("/:id", verifyToken, checkAdmin, updateCategory);

// ✅ Admin: Kategori sil (bağlı ürün yoksa)
router.delete("/:id", verifyToken, checkAdmin, deleteCategory);

module.exports = router;

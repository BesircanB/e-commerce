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
  deleteProduct
} = productController;

// --- Public routes (herkes erişebilir) ---
router.get("/", getAllProducts); // sadece is_visible:true ürünler
router.get("/all", verifyToken, checkAdmin, getAllProductsAdmin); // admin tüm ürünler
router.get("/:id/admin", verifyToken, checkAdmin, getProductByIdAdmin); // admin tek ürün
router.get("/:id", getProductById); // sadece görünür ürün (herkes)


// --- Admin işlemleri ---
router.post("/", verifyToken, checkAdmin, createProduct);
//
router.put("/:id", verifyToken, checkAdmin, updateProduct);
//
router.put("/:id/stock", verifyToken, checkAdmin, updateProductStock);
//
router.delete("/:id", verifyToken, checkAdmin, deleteProduct);

module.exports = router;

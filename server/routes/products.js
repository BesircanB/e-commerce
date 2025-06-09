const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const checkAdmin = require("../middleware/checkAdmin");

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
  deleteProduct,
  checkIfUserPurchasedProduct,
  searchPublicProducts, // ✅ eklendi
} = productController;

// --- 🛡️ ADMIN ROUTES ---
router.get("/admin/all", verifyToken, checkAdmin, getAllProductsAdmin);
router.get("/admin/:id", verifyToken, checkAdmin, getProductByIdAdmin);
router.put("/admin/:id/visibility", verifyToken, checkAdmin, updateProductVisibility);
router.post("/", verifyToken, checkAdmin, createProduct);
router.put("/:id", verifyToken, checkAdmin, updateProduct);
router.put("/:id/stock", verifyToken, checkAdmin, updateProductStock);
router.delete("/:id", verifyToken, checkAdmin, deleteProduct);

// --- 👤 PUBLIC ROUTES ---
router.get("/search", searchPublicProducts); // ✅ public search route
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.get("/:id/has-purchased", verifyToken, checkIfUserPurchasedProduct); // ✅ satın alma kontrolü

module.exports = router;

const express     = require("express");
const router      = express.Router();
const verifyToken = require("../middleware/verifyToken");

// Controller fonksiyonlarını içe aktar
const cartController = require("../controllers/cartController");

console.log("--- routes/cart.js ---");
console.log("cartController objesi:", cartController);
console.log("typeof cartController.addToCart:", typeof cartController.addToCart);
console.log("typeof cartController.getCart:", typeof cartController.getCart);
console.log("typeof cartController.updateCartItem:", typeof cartController.updateCartItem);
console.log("typeof cartController.deleteCartItem:", typeof cartController.deleteCartItem);
console.log("typeof verifyToken:", typeof verifyToken);

const {
  addToCart,
  getCart,
  updateCartItem,
  deleteCartItem,
  applyCouponToCart,
  clearCart 
} = cartController;

// Tüm cart rotaları için JWT doğrulama
router.use(verifyToken);

// POST /cart → Sepete ürün ekle
if (typeof addToCart !== 'function') console.error("HATA: addToCart bir fonksiyon değil!");
router.post("/", addToCart);

// GET /cart → Kullanıcının sepetini getir
if (typeof getCart !== 'function') console.error("HATA: getCart bir fonksiyon değil!");
router.get("/", getCart);

// PUT /cart/:id → Sepet öğesini güncelle
if (typeof updateCartItem !== 'function') console.error("HATA: updateCartItem bir fonksiyon değil!");
router.put("/:id", updateCartItem);

// DELETE /cart/:id → Sepet öğesini sil
if (typeof deleteCartItem !== 'function') console.error("HATA: deleteCartItem bir fonksiyon değil!");
router.delete("/:id", deleteCartItem);

router.post("/apply-coupon",applyCouponToCart);

router.delete("/", clearCart); // sepeti direkt sil



module.exports = router;

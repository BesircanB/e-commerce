// server/routes/cart.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const {
  addToCart,
  getCart,
  updateCartItem,
  deleteCartItem // or removeFromCart as per controller naming
} = require('../controllers/cartController');

// Tüm cart rotaları için JWT doğrulama middleware'i
router.use(verifyToken);

// Sepete ürün ekleme
router.post('/', addToCart);

// Kullanıcının sepetini getirme
router.get('/', getCart);

// Sepet öğesini güncelleme
router.put('/:id', updateCartItem);

// Sepet öğesini silme
router.delete('/:id', deleteCartItem);

module.exports = router;

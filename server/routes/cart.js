// routes/cart.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem
} = require("../controllers/cartController");

router.use(verifyToken);

router.post("/", addToCart);
router.get("/", getCart);
router.put("/:id", updateCartItem);
router.delete("/:id", removeFromCart);

module.exports = router;

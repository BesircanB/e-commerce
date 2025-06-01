const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

const {
  addToWishlist,
  getWishlist,
  removeFromWishlist
} = require("../controllers/wishlistController");

router.use(verifyToken);

router.post("/", addToWishlist);
router.get("/", getWishlist);
router.delete("/:product_id", removeFromWishlist);

module.exports = router;

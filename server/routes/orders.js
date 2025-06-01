const express      = require("express");
const router       = express.Router();
const verifyToken  = require("../middleware/verifyToken");
const checkAdmin   = require("../middleware/checkAdmin");
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
} = require("../controllers/orderController");

router.use(verifyToken);

// POST   /api/orders
router.post("/", createOrder);

// GET    /api/orders/all
router.get("/all", checkAdmin, getAllOrders);

// GET    /api/orders/my
router.get("/my", getMyOrders);

// GET    /api/orders/:id
router.get("/:id", getOrderById);

// PUT    /api/orders/:id/status
router.put("/:id/status", checkAdmin, updateOrderStatus);

// PATCH  /api/orders/:id/cancel
router.patch("/:id/cancel", cancelOrder);

module.exports = router;

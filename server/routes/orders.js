const express      = require("express");
const router       = express.Router();
const verifyToken  = require("../middleware/verifyToken");
const checkAdmin   = require("../middleware/checkAdmin");
const {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
} = require("../controllers/orderController");

router.use(verifyToken);

// Her orders endpointine gelen isteği ve kullanıcı bilgisini logla
router.use((req, res, next) => {
  console.log(`[ROUTE LOG] ${req.method} ${req.originalUrl}`);
  console.log(`[ROUTE LOG] Auth user:`, req.user);
  next();
});

// POST   /api/orders
router.post("/", createOrder);

// GET    /api/orders/all
router.get("/all", checkAdmin, getAllOrders);

router.get("/my", (req, res, next) => {
  console.log("[ROUTE LOG] /api/orders/my endpoint tetiklendi");
  console.log("[ROUTE LOG] req.user:", req.user);
  next();
}, getUserOrders);


// GET    /api/orders/:id
router.get("/:id", getOrderById);

// PUT    /api/orders/:id/status
router.put("/:id/status", checkAdmin, updateOrderStatus);

// PATCH  /api/orders/:id/cancel
router.patch("/:id/cancel", cancelOrder);



module.exports = router;

// server/routes/admin.js
const express     = require("express");
const router      = express.Router();
const verifyToken = require("../middleware/verifyToken");
const checkAdmin  = require("../middleware/checkAdmin");
const { getAdminMetrics } = require("../controllers/adminController");

// GET /api/admin/metrics → Admin dashboard verileri
router.get("/metrics", verifyToken, checkAdmin, getAdminMetrics);

module.exports = router;
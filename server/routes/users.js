// server/routes/users.js

const express     = require("express");
const router      = express.Router();
const verifyToken = require("../middleware/verifyToken");
const checkAdmin  = require("../middleware/checkAdmin");

const userController = require("../controllers/userController");

const {
  getProfile,
  updateProfile
} = userController;

// 👤 Kullanıcı kendi profilini görüntüler
router.get("/profile", verifyToken, getProfile);

// 👤 Kullanıcı profilini günceller (email, phone, address)
router.put("/profile", verifyToken, updateProfile);

module.exports = router;

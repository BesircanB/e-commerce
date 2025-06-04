const express = require("express");
const router = express.Router();

const {
  register,
  login,
  googleLogin,   
  forgotPassword,
  resetPassword 
  
} = require("../controllers/authController");

// ✅ Normal kayıt ve giriş
router.post("/register", register);
router.post("/login", login);

// ✅ Google Login – Google Identity'den alınan token ile
router.post("/google-login", googleLogin);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);




module.exports = router;

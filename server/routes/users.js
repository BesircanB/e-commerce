
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

// Controller fonksiyonlarını içe aktar
const userController = require("../controllers/userController");

console.log("--- routes/users.js ---");
console.log("userController objesi:", userController); // Tüm fonksiyonları içeren bir obje olmalı
console.log("typeof userController.getAllUsers:", typeof userController.getAllUsers);
console.log("typeof userController.createUser:", typeof userController.createUser);
console.log("typeof userController.loginUser:", typeof userController.loginUser);
console.log("typeof userController.getProfile:", typeof userController.getProfile);
console.log("typeof verifyToken:", typeof verifyToken);

const {
  getAllUsers,
  createUser,
  loginUser,
  getProfile
} = userController; // Değişiklik yok, sadece loglardan sonra destruct.

// GET /users → Tüm kullanıcıları getir
if (typeof getAllUsers !== 'function') console.error("HATA: getAllUsers bir fonksiyon değil!");
router.get("/", getAllUsers);

// POST /users/register → Yeni kullanıcı oluştur
if (typeof createUser !== 'function') console.error("HATA: createUser bir fonksiyon değil!");
router.post("/register", createUser);

// POST /users/login → Kullanıcı girişi (JWT token döner)
if (typeof loginUser !== 'function') console.error("HATA: loginUser bir fonksiyon değil!");
router.post("/login", loginUser);

// GET /users/profile → Token doğrulaması ile profil bilgisi
if (typeof verifyToken !== 'function') console.error("HATA: verifyToken bir fonksiyon değil!");
if (typeof getProfile !== 'function') console.error("HATA: getProfile bir fonksiyon değil!");
router.get("/profile", verifyToken, getProfile);

module.exports = router;

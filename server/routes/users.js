const express     = require("express");
const router      = express.Router();
const verifyToken = require("../middleware/verifyToken");
const checkAdmin  = require("../middleware/checkAdmin");

// Controller fonksiyonlarını içe aktar
const userController = require("../controllers/userController");

console.log("--- routes/users.js ---");
console.log("userController objesi:", userController);
console.log("typeof userController.getAllUsers:", typeof userController.getAllUsers);
console.log("typeof userController.createUser:", typeof userController.createUser);
console.log("typeof userController.loginUser:", typeof userController.loginUser);
console.log("typeof userController.getProfile:", typeof userController.getProfile);
console.log("typeof verifyToken:", typeof verifyToken);
console.log("typeof checkAdmin:", typeof checkAdmin);

const {
  getAllUsers,
  createUser,
  loginUser,
  getProfile
} = userController;

// GET /users → Tüm kullanıcıları getir (SADECE ADMIN)
if (typeof getAllUsers !== 'function') console.error("HATA: getAllUsers bir fonksiyon değil!");
router.get(
  "/",
  verifyToken,
  checkAdmin,
  getAllUsers
);

// POST /users/register → Yeni kullanıcı oluştur (PUBLIC)
if (typeof createUser !== 'function') console.error("HATA: createUser bir fonksiyon değil!");
router.post("/register", createUser);

// POST /users/login → Kullanıcı girişi (PUBLIC)
if (typeof loginUser !== 'function') console.error("HATA: loginUser bir fonksiyon değil!");
router.post("/login", loginUser);

// GET /users/profile → Kendi profilini gör (KULLANICI)
if (typeof verifyToken !== 'function') console.error("HATA: verifyToken bir fonksiyon değil!");
if (typeof getProfile !== 'function') console.error("HATA: getProfile bir fonksiyon değil!");
router.get("/profile", verifyToken, getProfile);

module.exports = router;

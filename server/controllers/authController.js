// server/controllers/authController.js

const authService = require("../services/authService");
const asyncHandler = require("../middleware/asyncHandler");

const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);
  res.status(201).json({ message: "Kayıt başarılı", user });
});

const login = asyncHandler(async (req, res) => {
  const { user, token } = await authService.login(req.body);
  res.json({ message: "Giriş başarılı", token, user });
});

const googleLogin = asyncHandler(async (req, res) => {
  const { token, user } = await authService.googleLogin(req.body.credential);
  res.json({ message: "Google login başarılı", token, user });
});

const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body.email);
  res.json({ message: "Şifre sıfırlama bağlantısı gönderildi" });
});

const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body.token, req.body.newPassword);
  res.json({ message: "Şifre başarıyla güncellendi" });
});

module.exports = {
  register,
  login,
  googleLogin,
  forgotPassword,
  resetPassword,
};

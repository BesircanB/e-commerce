// server/controllers/authController.js
const authService = require("../services/authService");

async function register(req, res) {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ message: "Kayıt başarılı", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function login(req, res) {
  try {
    const { user, token } = await authService.login(req.body);
    res.json({ message: "Giriş başarılı", token, user });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

async function googleLogin(req, res) {
  try {
    const { token, user } = await authService.googleLogin(req.body.credential);
    res.json({ message: "Google login başarılı", token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function forgotPassword(req, res) {
  try {
    await authService.forgotPassword(req.body.email);
    res.json({ message: "Şifre sıfırlama bağlantısı gönderildi" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function resetPassword(req, res) {
  try {
    await authService.resetPassword(req.body.token, req.body.newPassword);
    res.json({ message: "Şifre başarıyla güncellendi" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  register,
  login,
  googleLogin,
  forgotPassword,
  resetPassword,
};

const userService = require("../services/userService");

// GET /api/users/profile
async function getProfile(req, res) {
  try {
    console.log("[USER] getProfile endpoint çağrıldı");
    console.log("[USER] req.user:", req.user);
    const userId = req.user.id || req.user.userId;
    console.log("[USER] getProfile userId:", userId);
    const user = await userService.getProfile(userId);
    console.log("[USER] getProfile user: ", user);
    res.status(200).json(user);
  } catch (err) {
    console.error("[USER] getProfile error:", err.message, err);
    res.status(404).json({ error: err.message });
  }
}

// PUT /api/users/profile
async function updateProfile(req, res) {
  try {
    // Hem id hem userId olasılığını kapsar
    const userId = req.user.id || req.user.userId;
    const updated = await userService.updateProfile(userId, req.body);
    res.status(200).json({ message: "Profil güncellendi", user: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}


// PUT /api/users/change-password
async function changePassword(req, res) {
  try {


    const userId = req.user.id || req.user.userId;
    const result = await userService.changePassword(userId, req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
};

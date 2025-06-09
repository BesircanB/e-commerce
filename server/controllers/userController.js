const userService = require("../services/userService");

// GET /api/users/profile
async function getProfile(req, res) {
  try {
    const user = await userService.getProfile(req.user.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

// PUT /api/users/profile
async function updateProfile(req, res) {
  try {
    const updated = await userService.updateProfile(req.user.id, req.body);
    res.status(200).json({ message: "Profil güncellendi", user: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// PUT /api/users/change-password
async function changePassword(req, res) {
  try {
    const result = await userService.changePassword(req.user.id, req.body);
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

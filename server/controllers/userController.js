// server/controllers/userController.js
const supabase = require("../services/supabase");

const getAllUsers = async (req, res) => {
  const { data, error } = await supabase.from("users").select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
};

module.exports = {
  getAllUsers,
};

// server/controllers/userController.js
const supabase = require("../services/supabase");

// Tüm kullanıcıları getir (SADECE ADMIN)
const getAllUsers = async (req, res) => {
  try {
    const { data, error } = await supabase.from("users").select("*");
    if (error) throw error;
    return res.json(data);
  } catch (err) {
    console.error("Get all users error:", err);

    return res.status(500).json({ error: err.message });
  }
};

const getProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, email, role, phone, address, created_at")
      .eq("id", userId)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("Profil getirme hatası:", err);
    return res.status(500).json({ error: err.message });
  }
};

// PUT /api/users/profile → Kullanıcı bilgilerini günceller
const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { email, phone, address } = req.body;

  if (!email && !phone && !address) {
    return res.status(400).json({ error: "En az bir alan gönderilmelidir" });
  }

  try {
    const updates = {};
    if (email) updates.email = email;
    if (phone) updates.phone = phone;
    if (address) updates.address = address;

    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", userId)
      .select("id, email, phone, address, role");

    if (error) throw error;

    return res.status(200).json({ message: "Profil güncellendi", user: data[0] });
  } catch (err) {
    console.error("Profil güncelleme hatası:", err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getProfile,
  updateProfile
};
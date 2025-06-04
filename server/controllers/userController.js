// server/controllers/userController.js
const supabase = require("../services/supabase");

// GET /api/users/profile
const getProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, email, role, phone, address, created_at")
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

// PUT /api/users/profile
const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { name, email, phone, address } = req.body;

  if (!email && !phone && !address && !name) {
    return res.status(400).json({ error: "En az bir alan gönderilmelidir" });
  }

  try {
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (phone) updates.phone = phone;
    if (address) updates.address = address;

    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", userId)
      .select("id, name, email, phone, address, role");

    if (error) throw error;

    return res
      .status(200)
      .json({ message: "Profil güncellendi", user: data[0] });
  } catch (err) {
    console.error("Profil güncelleme hatası:", err);
    return res.status(500).json({ error: err.message });
  }
};

const changePassword = async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: "Her iki şifre alanı zorunludur" });
  }

  // 1. Kullanıcıyı al
  const { data: user, error } = await supabase
    .from("users")
    .select("password")
    .eq("id", userId)
    .single();

  if (error || !user) {
    return res.status(404).json({ error: "Kullanıcı bulunamadı" });
  }

  // 2. Eski şifre doğru mu?
  const match = await bcrypt.compare(oldPassword, user.password);
  if (!match) {
    return res.status(401).json({ error: "Eski şifre yanlış" });
  }

  // 3. Yeni şifreyi hashle
  const hashed = await bcrypt.hash(newPassword, 10);

  // 4. Şifreyi güncelle
  const { error: updateErr } = await supabase
    .from("users")
    .update({ password: hashed })
    .eq("id", userId);

  if (updateErr) {
    return res.status(500).json({ error: "Şifre güncellenemedi" });
  }

  return res.status(200).json({ message: "Şifre başarıyla güncellendi" });
};





module.exports = {
  getProfile,
  updateProfile,
  changePassword
};

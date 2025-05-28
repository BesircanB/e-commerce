// server/controllers/userController.js
const supabase = require("../services/supabase");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

// Yeni kullanıcı oluştur (PUBLIC)
const createUser = async (req, res) => {
  const { email, password, role } = req.body;
 
  if (!email || !password || !role) {
    return res
      .status(400)
      .json({ error: "Email, password ve role zorunlu" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
   
    const { data, error } = await supabase
      .from("users")
      .insert([{ email, password: hashedPassword, role }])
      .select();
    if (error) {
      if (error.code === "23505") {
        return res.status(409).json({ error: "Bu email zaten kayıtlı" });
      }
      throw error;
    }
    const newUser = data[0];
    delete newUser.password;
    return res
      .status(201)
      .json({ message: "Kullanıcı başarıyla oluşturuldu", user: newUser });
  } catch (err) {
    console.error("Create user error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Kullanıcı girişi (PUBLIC)
const loginUser = async (req, res) => {
 
  const { email, password } = req.body;
 
  if (!email || !password) {
    return res.status(400).json({ error: "Email ve password zorunlu" });
  }

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, password, role")
      .eq("email", email)
      .single();
    if (error || !user) {
      return res.status(401).json({ error: "Geçersiz kimlik bilgileri" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Geçersiz kimlik bilgileri" });
    }


    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    delete user.password;
    return res.json({ message: "Giriş başarılı", token, user });
  } catch (err) {
    console.error("Login user error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Profil bilgisi (KULLANICI)
const getProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, email, role, created_at")
      .eq("id", userId)
      .single();
    if (error || !data) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }
    return res.json(data);
  } catch (err) {
    console.error("Get profile error:", err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  loginUser,
  getProfile,
};

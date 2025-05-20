

const supabase = require("../services/supabase");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // loginUser için eklendi

// Tüm kullanıcıları getir
const getAllUsers = async (req, res) => {
  const { data, error } = await supabase.from("users").select("*");

  if (error) {
    console.error("Get all users error:", error);
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
};

// Yeni kullanıcı oluştur
const createUser = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: "Email, password, and role are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("users")
      .insert([{ email, password: hashedPassword, role }])
      .select(); // Eklenen veriyi geri döndürmek için .select()

    if (error) {
      // Supabase'den gelen spesifik hataları kontrol et (örn: unique constraint)
      if (error.code === '23505') { // '23505' unique violation error code for PostgreSQL
        return res.status(409).json({ error: "User with this email already exists." });
      }
      console.error("Create user error:", error);
      return res.status(400).json({ error: error.message });
    }
    
    // Supabase v2'de insert direkt olarak array döner, ilk elemanı al
    const newUser = data && data.length > 0 ? data[0] : null;
    if (!newUser) {
        return res.status(500).json({ error: "Failed to create user or retrieve created user."})
    }
    // Şifreyi yanıttan kaldır
    delete newUser.password;

    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (err) {
    console.error("Create user server error:", err);
    res.status(500).json({ error: "Server error during user creation" });
  }
};

// Kullanıcı girişi
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const { data: users, error: fetchError } = await supabase
      .from("users")
      .select("id, email, password, role") // Şifreyi de alıp karşılaştırma yapacağız
      .eq("email", email)
      .single(); // E-posta unique olmalı, bu yüzden tek bir kullanıcı bekliyoruz

    if (fetchError || !users) {
      // fetchError null olabilir ama users da null olabilir (kullanıcı bulunamadı)
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordIsValid = await bcrypt.compare(password, users.password);

    if (!passwordIsValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Kullanıcı bilgileriyle token oluştur
    const token = jwt.sign(
      { id: users.id, email: users.email, role: users.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token geçerlilik süresi
    );

    // Şifreyi yanıttan kaldır
    delete users.password;

    res.json({ message: "Login successful", token, user: users });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
};

// Profil bilgisini getir
const getProfile = (req, res) => {
  // verifyToken middleware'i req.user'ı eklemiş olmalı
  if (!req.user) {
    return res.status(401).json({ error: "Not authorized, user data missing from token" });
  }
  // İsteğe bağlı olarak Supabase'den en güncel kullanıcı verisini çekebilirsiniz
  // Ama token içindeki bilgi genellikle yeterlidir.
  res.json({
    message: "Profile data retrieved successfully",
    user: req.user
  });
};

// ... (getAllUsers, createUser, loginUser, getProfile fonksiyon tanımlamaları yukarıda) ...

module.exports = {
  getAllUsers,
  createUser,
  loginUser,
  getProfile
};

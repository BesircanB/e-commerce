// server/controllers/authController.js
const { createClient } = require("@supabase/supabase-js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

// Public (anon) client: SELECT, LOGIN vb. işlemler için
const supabaseAnon = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Admin (service_role) client: REGISTER işlemi için insert + fetch
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function register(req, res) {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email ve şifre zorunlu" });
    }

    const hashed = await bcrypt.hash(password, 10);

    // 1) Yalnızca insert yap
    const { error: insertError } = await supabaseAdmin
      .from("users")
      .insert([{ email, password: hashed, role: role || "user" }]);
    if (insertError) {
      if (insertError.code === "23505") {
        return res.status(409).json({ error: "Bu email zaten kayıtlı" });
      }
      console.error("Register insert error:", insertError);
      return res.status(500).json({ error: insertError.message });
    }

    // 2) Eklenen satırı fetch et (tüm alanlarla)
    const { data: newUser, error: fetchError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", email)
      .single();
    if (fetchError || !newUser) {
      console.error("Register fetch error:", fetchError, newUser);
      return res
        .status(500)
        .json({ error: "Kayıt yapıldı ama veri alınamadı" });
    }

    return res.status(201).json({
      message: "Kullanıcı başarıyla oluşturuldu",
      user: newUser,
    });
  } catch (err) {
    console.error("Register catch:", err);
    return res.status(500).json({ error: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email ve şifre zorunlu" });
    }

    // Kullanıcıyı public client ile al
    const { data, error } = await supabaseAnon
      .from("users")
      .select("id, email, password, role")
      .eq("email", email)
      .single();
    if (error || !data) {
      return res.status(401).json({ error: "Geçersiz email veya şifre" });
    }

    // Şifre kontrolü
    const match = await bcrypt.compare(password, data.password);
    if (!match) {
      return res.status(401).json({ error: "Geçersiz email veya şifre" });
    }

    // JWT oluştur
    const token = jwt.sign(
      { userId: data.id, email: data.email, role: data.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      message: "Giriş başarılı",
      token,
      user: { id: data.id, email: data.email, role: data.role },
    });
  } catch (err) {
    console.error("Login catch:", err);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { register, login };

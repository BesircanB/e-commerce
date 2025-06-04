const { createClient } = require("@supabase/supabase-js");
const { v5: uuidv5 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");
const { sendMail } = require("../services/emailService");
const crypto = require("crypto");

// Supabase bağlantıları
const supabaseAnon = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Google Client
const client = new OAuth2Client();

// ==============================
// Kullanıcı Kayıt
// ==============================
async function register(req, res) {
  try {
    const { email, password, role, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Email, şifre ve ad zorunlu" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const { error: insertError } = await supabaseAdmin
      .from("users")
      .insert([{ email, password: hashed, role: role || "user", name }]);

    if (insertError) {
      if (insertError.code === "23505") {
        return res.status(409).json({ error: "Bu email zaten kayıtlı" });
      }
      console.error("Register insert error:", insertError);
      return res.status(500).json({ error: insertError.message });
    }

    const { data: newUser, error: fetchError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (fetchError || !newUser) {
      console.error("Register fetch error:", fetchError, newUser);
      return res.status(500).json({ error: "Kayıt yapıldı ama veri alınamadı" });
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

// ==============================
// Kullanıcı Giriş
// ==============================
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email ve şifre zorunlu" });
    }

    const { data, error } = await supabaseAnon
      .from("users")
      .select("id, email, password, role, name")
      .eq("email", email)
      .single();

    if (error || !data) {
      return res.status(401).json({ error: "Geçersiz email veya şifre" });
    }

    const match = await bcrypt.compare(password, data.password);
    if (!match) {
      return res.status(401).json({ error: "Geçersiz email veya şifre" });
    }

    const token = jwt.sign(
      { userId: data.id, email: data.email, role: data.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      message: "Giriş başarılı",
      token,
      user: {
        id: data.id,
        email: data.email,
        role: data.role,
        name: data.name,
      },
    });
  } catch (err) {
    console.error("Login catch:", err);
    return res.status(500).json({ error: err.message });
  }
}

// ==============================
// Google ile Giriş
// ==============================
async function googleLogin(req, res) {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ error: "Google token (credential) eksik." });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const sub = payload.sub;
    const email = payload.email;
    const name = payload.name;

    const { data: existingUser, error: fetchErr } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    let userId;

    if (!existingUser) {
      const NAMESPACE = "aee7f7b2-6577-4872-9e7b-df5e52be6b13";
      userId = uuidv5(sub, NAMESPACE);

      const fakePassword = await bcrypt.hash("google-auth", 10);

      const { error: insertError } = await supabaseAdmin.from("users").insert({
        id: userId,
        email,
        name,
        role: "user",
        password: fakePassword,
      });

      if (insertError) {
        console.error("Kullanıcı eklenemedi:", insertError);
        return res.status(500).json({ error: "Kullanıcı eklenemedi" });
      }
    } else {
      userId = existingUser.id;
    }

    const token = jwt.sign(
      { userId, email, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Google login başarılı",
      token,
      user: {
        id: userId,
        email,
        name,
        role: "user",
      },
    });
  } catch (err) {
    console.error("Google login hatası:", err);
    return res.status(500).json({ error: err.message || "Google token doğrulanamadı" });
  }
}

// ==============================
// Şifremi Unuttum – Token Gönderme
// ==============================
async function forgotPassword(req, res) {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email zorunludur" });
  }

  const { data: user, error } = await supabaseAdmin
    .from("users")
    .select("id, email, name")
    .eq("email", email)
    .maybeSingle();

  if (error || !user) {
    return res.status(404).json({ error: "Bu email ile kayıtlı kullanıcı bulunamadı" });
  }

  const token = crypto.randomBytes(20).toString("hex");

  const { error: insertErr } = await supabaseAdmin
    .from("password_resets")
    .insert({
      user_id: user.id,
      token,
      expires_at: new Date(Date.now() + 30 * 60 * 1000), // 30 dk
    });

  if (insertErr) {
    console.error("Token insert error:", insertErr);
    return res.status(500).json({ error: "Token oluşturulamadı" });
  }

  const resetLink = `http://localhost:3000/reset-password?token=${token}`;

  const html = `
    <p>Merhaba ${user.name},</p>
    <p>Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:</p>
    <a href="${resetLink}">Şifreyi Sıfırla</a>
    <p>Bu bağlantı 30 dakika boyunca geçerlidir.</p>
  `;

  await sendMail({
    to: user.email,
    subject: "Şifre Sıfırlama Bağlantısı",
    html,
    text: `Şifrenizi sıfırlamak için bu bağlantıyı kullanın: ${resetLink}`,
  });

  return res.status(200).json({
    message: "Şifre sıfırlama bağlantısı e-posta ile gönderildi",
  });
}

async function resetPassword(req, res) {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: "Token ve yeni şifre zorunludur" });
  }

  // 1. Token'ı bul
  const { data: resetRecord, error } = await supabaseAdmin
    .from("password_resets")
    .select("user_id, expires_at")
    .eq("token", token)
    .maybeSingle();

  if (error || !resetRecord) {
    return res.status(400).json({ error: "Geçersiz veya süresi dolmuş bağlantı" });
  }

  // 2. Süresi geçmiş mi kontrol et
  const now = new Date();
  if (new Date(resetRecord.expires_at) < now) {
    return res.status(400).json({ error: "Bu bağlantının süresi dolmuş" });
  }

  // 3. Yeni şifreyi hashle
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // 4. Kullanıcının şifresini güncelle
  const { error: updateErr } = await supabaseAdmin
    .from("users")
    .update({ password: hashedPassword })
    .eq("id", resetRecord.user_id);

  if (updateErr) {
    return res.status(500).json({ error: "Şifre güncellenemedi" });
  }

  // 5. Token'ı sil
  await supabaseAdmin
    .from("password_resets")
    .delete()
    .eq("token", token);

  return res.status(200).json({ message: "Şifre başarıyla güncellendi" });
}






module.exports = {
  register,
  login,
  googleLogin,
  forgotPassword,
  resetPassword
};

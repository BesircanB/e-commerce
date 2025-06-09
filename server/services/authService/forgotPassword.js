const crypto = require("crypto");
const { sendMail } = require("../emailService");
const supabaseAdmin = require("../supabase").supabaseAdmin;

async function forgotPassword(email) {
  const { data: user, error } = await supabaseAdmin
    .from("users")
    .select("id, email, name")
    .eq("email", email)
    .maybeSingle();

  if (error || !user) throw new Error("Bu email ile kayıtlı kullanıcı yok");

  const token = crypto.randomBytes(20).toString("hex");

  await supabaseAdmin.from("password_resets").insert({
    user_id: user.id,
    token,
    expires_at: new Date(Date.now() + 30 * 60 * 1000),
  });

  const resetLink = `http://localhost:3000/reset-password?token=${token}`;

  await sendMail({
    to: user.email,
    subject: "Şifre Sıfırlama Bağlantısı",
    html: `<p>Merhaba ${user.name},</p><p><a href="${resetLink}">Şifreyi Sıfırla</a></p>`,
    text: `Şifreyi sıfırlamak için bu linki kullan: ${resetLink}`,
  });
}

module.exports = forgotPassword;

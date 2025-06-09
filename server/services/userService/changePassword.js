const supabase = require("../supabase");
const bcrypt = require("bcrypt");
const { validatePasswordChange } = require("../../utils/userHelpers");

async function changePassword(userId, { oldPassword, newPassword }) {
  const validationError = validatePasswordChange({ oldPassword, newPassword });
  if (validationError) throw new Error(validationError);

  // Kullanıcının mevcut şifresini al
  const { data: user, error: fetchErr } = await supabase
    .from("users")
    .select("password")
    .eq("id", userId)
    .single();

  if (fetchErr || !user) throw new Error("Kullanıcı bulunamadı");

  // Şifre doğru mu
  const match = await bcrypt.compare(oldPassword, user.password);
  if (!match) throw new Error("Eski şifre yanlış");

  // Yeni şifreyi hashle
  const hashed = await bcrypt.hash(newPassword, 10);

  // Güncelle
  const { error: updateErr } = await supabase
    .from("users")
    .update({ password: hashed })
    .eq("id", userId);

  if (updateErr) throw new Error("Şifre güncellenemedi");

  return { message: "Şifre başarıyla güncellendi" };
}

module.exports = changePassword;

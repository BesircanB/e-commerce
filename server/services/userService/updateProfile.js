const supabase = require("../supabase");
const { sanitizeProfileInput } = require("../../utils/userHelpers");

async function updateProfile(userId, input) {
  if (!userId) throw new Error("Kullanıcı ID gerekli");

  const updates = sanitizeProfileInput(input);

  if (Object.keys(updates).length === 0) {
    throw new Error("En az bir alan gönderilmelidir");
  }

  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId)
    .select("id, name, email, phone, address, role")
    .single();

  if (error) throw new Error("Profil güncellenemedi");

  return data;
}

module.exports = updateProfile;

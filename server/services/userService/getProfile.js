const {supabaseAdmin} = require("../supabase");

async function getProfile(userId) {
  if (!userId) throw new Error("Kullanıcı ID gerekli");

  const { data, error } = await supabaseAdmin
    .from("users")
    .select("id, name, email, role, phone, address, created_at")
    .eq("id", userId)
    .single();

  if (error || !data) {
    throw new Error("Kullanıcı bulunamadı");
  }

  return data;
}

module.exports = getProfile;

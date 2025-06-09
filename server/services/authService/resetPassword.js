const bcrypt = require("bcrypt");
const supabaseAdmin = require("../supabase").supabaseAdmin;

async function resetPassword(token, newPassword) {
  const { data: resetRecord, error } = await supabaseAdmin
    .from("password_resets")
    .select("user_id, expires_at")
    .eq("token", token)
    .maybeSingle();

  if (error || !resetRecord) throw new Error("Token geçersiz veya süresi dolmuş");

  if (new Date(resetRecord.expires_at) < new Date()) {
    throw new Error("Token süresi dolmuş");
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  await supabaseAdmin
    .from("users")
    .update({ password: hashed })
    .eq("id", resetRecord.user_id);

  await supabaseAdmin.from("password_resets").delete().eq("token", token);
}

module.exports = resetPassword;

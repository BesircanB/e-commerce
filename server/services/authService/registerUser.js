const bcrypt = require("bcrypt");
const supabaseAdmin = require("../supabase").supabaseAdmin;

async function registerUser({ email, password, name, role = "user" }) {
  const hashed = await bcrypt.hash(password, 10);

  const { error: insertError } = await supabaseAdmin
    .from("users")
    .insert([{ email, password: hashed, role, name }]);

  if (insertError) throw insertError;

  const { data: newUser, error: fetchError } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (fetchError || !newUser) {
    throw new Error("Kayıt yapıldı ama veri alınamadı");
  }

  return newUser;
}

module.exports = registerUser;

const bcrypt = require("bcrypt");
const supabase = require("../supabase");
const { generateToken } = require("./tokenService");

async function loginUser({ email, password }) {
  const { data, error } = await supabase
    .from("users")
    .select("id, email, password, role, name")
    .eq("email", email)
    .single();

  if (error || !data) throw new Error("Geçersiz email veya şifre");

  const match = await bcrypt.compare(password, data.password);
  if (!match) throw new Error("Geçersiz email veya şifre");

  const token = generateToken(data);
  return { user: data, token };
}

module.exports = loginUser;

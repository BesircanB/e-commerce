const { OAuth2Client } = require("google-auth-library");
const bcrypt = require("bcrypt");
const { v5: uuidv5 } = require("uuid");
const { generateToken } = require("./tokenService");
const supabaseAdmin = require("../supabase").supabaseAdmin;

const client = new OAuth2Client();

async function googleLogin(credential) {
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const { sub, email, name } = payload;

  const { data: existingUser } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  let userId;

  if (!existingUser) {
    userId = uuidv5(sub, "aee7f7b2-6577-4872-9e7b-df5e52be6b13");
    const fakePassword = await bcrypt.hash("google-auth", 10);

    const { error: insertError } = await supabaseAdmin.from("users").insert({
      id: userId,
      email,
      name,
      role: "user",
      password: fakePassword,
    });

    if (insertError) throw insertError;
  } else {
    userId = existingUser.id;
  }

  const token = generateToken({ id: userId, email, role: "user" });

  return {
    user: { id: userId, email, name, role: "user" },
    token,
  };
}

module.exports = googleLogin;

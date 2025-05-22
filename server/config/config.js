// server/config.js
require('dotenv').config();

module.exports = {
  port:        process.env.PORT,
  databaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_KEY,
  jwtSecret:   process.env.JWT_SECRET,
};

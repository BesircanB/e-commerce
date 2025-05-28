// server/services/supabase.js

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// Public (anon) client: SELECT, GET işlemleri için
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Admin (service_role) client: INSERT/UPDATE/DELETE + returning işlemleri için
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Default export: supabase
module.exports = supabase;

// Ek export: admin istemcisi
module.exports.supabaseAdmin = supabaseAdmin;

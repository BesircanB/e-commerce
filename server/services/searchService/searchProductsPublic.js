const supabase = require("../supabase");
const { sanitizeSearchInput, buildSearchQuery } = require("../../utils/searchHelpers");
const logSearchQuery = require("./logSearchQuery");

async function searchProductsPublic(userId, queryParams) {
  const filters = sanitizeSearchInput(queryParams);

  // Supabase query zinciri
  let query = supabase
    .from("crud")
    .select("id, name, description, price, image_url, category_id")
    .order("created_at", { ascending: false });

  query = buildSearchQuery(query, filters, false); // false → public search (visible=true)

  // Sorguyu çalıştır
  const { data, error } = await query;

  if (error) throw error;

  // Aramayı logla (kullanıcı giriş yapmışsa userId, değilse null)
  await logSearchQuery({
    userId,
    query: filters.q,
    category: filters.category,
    tag: filters.tag,
  });

  return data;
}

module.exports = searchProductsPublic;

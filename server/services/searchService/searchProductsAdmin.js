const supabase = require("../supabase");
const { sanitizeSearchInput, buildSearchQuery } = require("../../utils/searchHelpers");

async function searchProductsAdmin(queryParams) {
  const filters = sanitizeSearchInput(queryParams);

  let query = supabase
    .from("crud")
    .select("id, name, description, price, image_url, category_id, visible")
    .order("created_at", { ascending: false });

  // Admin olduğu için visible=true kısıtlaması yok
  query = buildSearchQuery(query, filters, true); // true → admin

  const { data, error } = await query;
  if (error) throw error;

  return data;
}

module.exports = searchProductsAdmin;

const supabase = require("../supabase");
const { sanitizeSearchInput, buildSearchQuery } = require("../../utils/searchHelpers");

async function searchProductsAdmin(queryParams) {
  const filters = sanitizeSearchInput(queryParams);

  let query = supabase
    .from("crud")
    .select(`
      id, name, description, price, image_url, stock, is_visible, category_id,
      product_tags:product_tags (
        tag_id,
        tags:tags (name)
      )
    `)
    .order("created_at", { ascending: false });

  // Admin olduğu için visible=true kısıtlaması yok
  query = buildSearchQuery(query, filters, true); // true → admin

  const { data, error } = await query;
  if (error) throw error;

  // Her ürünün tag isimlerini düz bir diziye dönüştür
  const result = data.map(product => ({
    ...product,
    tags: (product.product_tags || []).map(pt => pt.tags?.name).filter(Boolean)
  }));

  return result;
}

module.exports = searchProductsAdmin;

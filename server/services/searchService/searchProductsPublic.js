const supabase = require("../supabase");
const { sanitizeSearchInput, buildSearchQuery } = require("../../utils/searchHelpers");
const logSearchQuery = require("./logSearchQuery");

async function searchProductsPublic(userId, queryParams) {
  const filters = sanitizeSearchInput(queryParams);

  // 🔁 Supabase sorgusunu zincirlemeye uygun şekilde başlat
  let queryBuilder = supabase
    .from("crud")
    .select(`
      id, name, description, price, image_url, stock, is_visible, category_id,
      product_tags:product_tags (
        tag_id,
        tags:tags (name)
      )
    `)
    .eq("is_visible", true)
    .order("created_at", { ascending: false });

  // 🔧 Filtreleri uygula
  queryBuilder = buildSearchQuery(queryBuilder, filters, false);

  // 🔍 Test için log ekle
  console.log("Uygulanan filtreler:", filters);

  // 🧨 Sorguyu çalıştır
  const { data, error } = await queryBuilder;

  if (error) throw error;

  // Her ürünün tag isimlerini düz bir diziye dönüştür
  const result = data.map(product => ({
    ...product,
    tags: (product.product_tags || []).map(pt => pt.tags?.name).filter(Boolean)
  }));

  // Aramayı logla
  await logSearchQuery({
    userId,
    query: filters.q,
    category: filters.category,
    tag: filters.tag,
  });

  return result;
}

module.exports = searchProductsPublic;

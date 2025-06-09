const supabase = require("../supabase");

async function getAllProductsAdmin({ category, sortBy, minPrice, maxPrice }) {
  let query = supabase.from("crud").select("*");

  if (category) {
    query = query.eq("category", category);
  }

  if (minPrice) {
    query = query.gte("price", Number(minPrice));
  }

  if (maxPrice) {
    query = query.lte("price", Number(maxPrice));
  }

  if (sortBy === "price_asc") {
    query = query.order("price", { ascending: true });
  } else if (sortBy === "price_desc") {
    query = query.order("price", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data: products, error } = await query;

  if (error) {
    throw new Error("Admin ürün listesi alınamadı");
  }

  return products;
}

module.exports = getAllProductsAdmin;

const supabase = require("../supabase");

async function getProductById(productId) {
  if (!productId) throw new Error("Ürün ID gerekli");

  const { data: product, error } = await supabase
    .from("crud")
    .select("*")
    .eq("id", productId)
    .eq("is_visible", true)
    .single();

  if (error || !product) {
    throw new Error("Ürün bulunamadı");
  }

  return product;
}

module.exports = getProductById;

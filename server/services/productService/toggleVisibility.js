const supabase = require("../supabase");

async function toggleVisibility(productId, isVisible) {
  if (!productId || typeof isVisible !== "boolean") {
    throw new Error("Geçerli ürün ID ve görünürlük değeri gerekli");
  }

  const { data: updatedProduct, error } = await supabase
    .from("crud")
    .update({ is_visible: isVisible })
    .eq("id", productId)
    .select()
    .single();

  if (error || !updatedProduct) {
    throw new Error("Ürün görünürlüğü güncellenemedi");
  }

  return updatedProduct;
}

module.exports = toggleVisibility;

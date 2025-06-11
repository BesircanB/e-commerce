const {supabaseAdmin} = require("../supabase");

async function updateProductStock(productId, quantity) {
  if (!productId || typeof quantity !== "number") {
    throw new Error("Geçerli ürün ID ve stok miktarı gerekli");
  }

  const { data: updatedProduct, error } = await supabaseAdmin
    .from("crud")
    .update({ stock: quantity })
    .eq("id", productId)
    .select()
    .single();

  if (error || !updatedProduct) {
    throw new Error("Stok güncellemesi başarısız");
  }

  return updatedProduct;
}

module.exports = updateProductStock;

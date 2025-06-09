const supabase = require("../supabase");

async function deleteProduct(productId) {
  if (!productId) {
    throw new Error("Ürün ID zorunludur");
  }

  // 1. Ürün mevcut mu kontrol et
  const { data: existingProduct, error: fetchError } = await supabase
    .from("crud")
    .select("id, name")
    .eq("id", productId)
    .maybeSingle();

  if (fetchError || !existingProduct) {
    throw new Error("Silinmek istenen ürün bulunamadı");
  }

  // 2. Ürünü sil
  const { error: deleteError } = await supabase
    .from("crud")
    .delete()
    .eq("id", productId);

  if (deleteError) {
    throw new Error("Ürün silinemedi");
  }

  // 3. Supabase otomatik olarak: cart, wishlist, reviews → CASCADE ile silecek
  //    order_items → product_id = NULL olacak (SET NULL)

  return {
    message: `"${existingProduct.name}" ürünü başarıyla silindi.`,
    productId,
  };
}

module.exports = deleteProduct;

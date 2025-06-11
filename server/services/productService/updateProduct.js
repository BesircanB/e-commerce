const {supabaseAdmin} = require("../supabase");
const {
  validateProductInput,
  sanitizeProductInput,
} = require("../../utils/productHelpers");

async function updateProduct(productId, updateData) {
  if (!productId) {
    throw new Error("Ürün ID gerekli");
  }

  // 1. Mevcut ürünü çek
  const { data: existingProduct, error: fetchError } = await supabaseAdmin
    .from("crud")
    .select("*")
    .eq("id", productId)
    .single();

  if (fetchError || !existingProduct) throw new Error("Ürün bulunamadı");

  // 2. Güncellenecek alanları birleştir
  const mergedData = {
    ...existingProduct,
    ...updateData
  };

  const { error: validationError } = validateProductInput(mergedData);
  if (validationError) {
    throw new Error(validationError);
  }

  const sanitizedData = sanitizeProductInput(mergedData);

  const { data: updatedProduct, error } = await supabaseAdmin
    .from("crud") // senin ürün tablon
    .update(sanitizedData)
    .eq("id", productId)
    .select()
    .single();

  if (error || !updatedProduct) {
    throw new Error("Ürün güncellenemedi");
  }

  return updatedProduct;
}

module.exports = updateProduct;

const supabase = require("../supabase");
const {
  validateProductInput,
  sanitizeProductInput,
} = require("../../utils/productHelpers");

async function updateProduct(productId, updateData) {
  if (!productId) {
    throw new Error("Ürün ID gerekli");
  }

  const { error: validationError } = validateProductInput(updateData);
  if (validationError) {
    throw new Error(validationError);
  }

  const sanitizedData = sanitizeProductInput(updateData);

  const { data: updatedProduct, error } = await supabase
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

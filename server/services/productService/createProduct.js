const supabase = require("../supabase");
const {
  validateProductInput,
  sanitizeProductInput,
} = require("../../utils/productHelpers");

async function createProduct(data) {
  const { error: validationError } = validateProductInput(data);
  if (validationError) {
    throw new Error(validationError);
  }

  const cleanData = sanitizeProductInput(data);

  const { data: insertedProduct, error } = await supabase
    .from("crud") // NOT: tablon senin projen için 'crud'
    .insert([cleanData])
    .select()
    .single();

  if (error) {
    throw new Error("Ürün eklenemedi");
  }

  return insertedProduct;
}

module.exports = createProduct;

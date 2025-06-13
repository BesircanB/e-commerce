const supabase = require('./supabase');

async function getProductModels(productId) {
  const { data, error } = await supabase
    .from('product_models')
    .select('*')
    .eq('product_id', productId);
  if (error) throw error;
  return data;
}

async function addProductModel(productId, modelName) {
  const { data, error } = await supabase
    .from('product_models')
    .insert([{ product_id: productId, model_name: modelName }])
    .select();
  if (error) throw error;
  return data[0];
}

module.exports = { getProductModels, addProductModel }; 
const supabase = require('./supabase');

async function getModelColors(modelId) {
  const { data, error } = await supabase
    .from('product_model_colors')
    .select('*')
    .eq('product_model_id', modelId);
  if (error) throw error;
  return data;
}

async function addModelColor(modelId, color, stock = 0, priceAdjustment = null) {
  const { data, error } = await supabase
    .from('product_model_colors')
    .insert([{ 
      product_model_id: modelId, 
      color, 
      stock, 
      price_adjustment: priceAdjustment 
    }])
    .select();
  if (error) throw error;
  return data[0];
}

module.exports = { getModelColors, addModelColor }; 
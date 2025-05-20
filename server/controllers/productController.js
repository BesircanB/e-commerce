const supabase = require("../services/supabase");

// GET /api/products - Tüm ürünleri getir
const getAllProducts = async (req, res) => {
  const { data, error } = await supabase.from("crud").select("*").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// POST /api/products - Yeni ürün oluştur
const createProduct = async (req, res) => {
  const { name, description, price, image_url } = req.body;
  const { data, error } = await supabase.from("crud").insert([{ name, description, price, image_url }]).select();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data[0]);
};

// PUT /api/products/:id - Ürün güncelle
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image_url } = req.body;
  const { data, error } = await supabase.from("crud").update({ name, description, price, image_url }).eq("id", id).select();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
};

// DELETE /api/products/:id - Ürün sil
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("crud").delete().eq("id", id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Ürün silindi" });
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
};

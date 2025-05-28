// server/controllers/productController.js
const supabase = require("../services/supabase");

// GET /api/products
const getAllProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const minPrice =
      req.query.minPrice != null ? Number(req.query.minPrice) : null;
    const maxPrice =
      req.query.maxPrice != null ? Number(req.query.maxPrice) : null;
    const offset = (page - 1) * limit;

    let query = supabase.from("crud").select("*", { count: "exact" });
    if (minPrice !== null) query = query.gte("price", minPrice);
    if (maxPrice !== null) query = query.lte("price", maxPrice);

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) throw error;

    return res.json({ page, limit, total: count, data });
  } catch (err) {
    console.error("Get all products error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  const id = Number(req.params.id);
  try {
    const { data: product, error: prodErr } = await supabase
      .from("crud")
      .select("*")
      .eq("id", id)
      .single();
    if (prodErr || !product) {
      return res.status(404).json({ error: "Ürün bulunamadı" });
    }
    const { data: agg, error: aggErr } = await supabase
      .from("reviews")
      .select("avg:avg(rating)")
      .eq("product_id", id);
    if (aggErr) throw aggErr;
    product.averageRating = parseFloat(agg[0].avg) || 0;
    return res.json(product);
  } catch (err) {
    console.error("Get product by id error:", err);
    return res.status(500).json({ error: err.message });
  }
};

const createProduct = async (req, res) => {
  const { name, description, price, image_url, stock = 0 } = req.body;
  if (!name || price == null) {
    return res.status(400).json({ error: "Name ve price zorunlu" });
  }
  try {
    const { data, error } = await supabase
      .from("crud")
      .insert([{ name, description, price, image_url, stock }])
      .select();
    if (error) throw error;
    return res.status(201).json(data[0]);
  } catch (err) {
    console.error("Create product error:", err);
    return res.status(400).json({ error: err.message });
  }
};
//
const updateProduct = async (req, res) => {
  const id = Number(req.params.id);
  const changes = { ...req.body };
  delete changes.stock;
  try {
    const { data: existing, error: fetchError } = await supabase
      .from("crud")
      .select("id")
      .eq("id", id)
      .single();
    if (fetchError || !existing) {
      return res.status(404).json({ error: "Ürün bulunamadı" });
    }
    const { data, error } = await supabase
      .from("crud")
      .update(changes)
      .eq("id", id)
      .select();
    if (error) throw error;
    return res.json(data[0]);
  } catch (err) {
    console.error("Update product error:", err);
    return res.status(400).json({ error: err.message });
  }
};

const updateProductStock = async (req, res) => {
  const id = Number(req.params.id);
  const { stock } = req.body;
  if (stock == null || stock < 0) {
    return res.status(400).json({ error: "Geçersiz stok değeri" });
  }
  try {
    const { data: existing, error: fetchError } = await supabase
      .from("crud")
      .select("id")
      .eq("id", id)
      .single();
    if (fetchError || !existing) {
      return res.status(404).json({ error: "Ürün bulunamadı" });
    }
    const { data, error } = await supabase
      .from("crud")
      .update({ stock })
      .eq("id", id)
      .select();
    if (error) throw error;
    return res.json(data[0]);
  } catch (err) {
    console.error("Update product stock error:", err);
    return res.status(400).json({ error: err.message });
  }
};
//
const deleteProduct = async (req, res) => {
  const id = Number(req.params.id);
  try {
    const { data: existing, error: fetchError } = await supabase
      .from("crud")
      .select("id")
      .eq("id", id)
      .single();
    if (fetchError || !existing) {
      return res.status(404).json({ error: "Ürün bulunamadı" });
    }
    const { error } = await supabase.from("crud").delete().eq("id", id);
    if (error) throw error;
    return res.json({ message: "Ürün silindi" });
  } catch (err) {
    console.error("Delete product error:", err);
    return res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateProductStock,
  deleteProduct,
};

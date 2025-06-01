const supabase = require("../services/supabase");

// GET /api/products → Kullanıcılara özel (sadece görünür ürünler)
const getAllProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const minPrice = req.query.minPrice != null ? Number(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice != null ? Number(req.query.maxPrice) : null;
    const offset = (page - 1) * limit;

    let query = supabase
      .from("crud")
      .select("*", { count: "exact" })
      .eq("is_visible", true);

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

// GET /api/products/all → Admin'e özel, tüm ürünler
const getAllProductsAdmin = async (req, res) => {
  try {
    const { data, error, count } = await supabase
      .from("crud")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (error) throw error;

    return res.status(200).json({ total: count || 0, data: data || [] });
  } catch (err) {
    console.error("Get all products (admin) error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// GET /api/products/:id → yalnızca görünür olanlar
const getProductById = async (req, res) => {
  const id = Number(req.params.id);
  try {
    const { data: product, error: prodErr } = await supabase
      .from("crud")
      .select("*")
      .eq("id", id)
      .eq("is_visible", true)
      .single();

    if (prodErr || !product) {
      return res.status(404).json({ error: "Ürün bulunamadı" });
    }

    const { data: reviews, error: reviewsErr } = await supabase
      .from("reviews")
      .select("rating")
      .eq("product_id", id);

    if (reviewsErr) throw reviewsErr;

    const ratings = reviews.map(r => r.rating);
    const average = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
      : 0;

    product.averageRating = parseFloat(average.toFixed(2));
    return res.json(product);
  } catch (err) {
    console.error("Get product by id error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// GET /api/products/:id/admin → admin, is_visible fark etmeksizin görür
const getProductByIdAdmin = async (req, res) => {
  const id = Number(req.params.id);
  try {
    const { data, error } = await supabase
      .from("crud")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Ürün bulunamadı" });
    }

    return res.json(data);
  } catch (err) {
    console.error("Admin: get product by id error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// POST /api/products
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

// PUT /api/products/:id
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

// PUT /api/products/:id/stock
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

// DELETE /api/products/:id → Mantıksal silme
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
    const { error } = await supabase
      .from("crud")
      .update({ is_visible: false })
      .eq("id", id);
    if (error) throw error;
    return res.json({ message: "Ürün silindi (gizlendi)" });
  } catch (err) {
    console.error("Mantıksal silme hatası:", err);
    return res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getAllProducts,
  getAllProductsAdmin,
  getProductById,
  getProductByIdAdmin,
  createProduct,
  updateProduct,
  updateProductStock,
  deleteProduct,
};

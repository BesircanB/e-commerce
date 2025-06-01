// server/controllers/productController.js
const supabase = require("../services/supabase");


// GET /api/products → Kullanıcılara özel (sadece görünür ürünler)
// GET /api/products?name=&category=&minPrice=&maxPrice=&page=&limit=


const getAllProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const name = req.query.name?.toLowerCase() || null;
    const category = req.query.category?.toLowerCase() || null;
    const minPrice = req.query.minPrice != null ? Number(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice != null ? Number(req.query.maxPrice) : null;

    // Ana ürün sorgusu (ilişkili kategori adı dahil)
    let query = supabase
      .from("crud")
      .select("*, categories(name)", { count: "exact" }) // JOIN işlemi
      .eq("is_visible", true);

    // Filtreler
    if (name) query = query.ilike("name", `%${name}%`);
    if (minPrice !== null) query = query.gte("price", minPrice);
    if (maxPrice !== null) query = query.lte("price", maxPrice);

    if (category) {
      // Kategori adı varsa, önce ID'yi bul
      const { data: catData, error: catErr } = await supabase
        .from("categories")
        .select("id")
        .ilike("name", `%${category}%`)
        .single();

      if (catErr || !catData) {
        return res.status(400).json({ error: "Kategori bulunamadı" });
      }

      query = query.eq("category_id", catData.id);
    }

    const { data, count, error } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return res.json({
      page,
      limit,
      total: count,
      data
    });
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
  const { name, description, price, image_url, stock = 0, category_id } = req.body;

  // Zorunlu alanlar kontrolü
  if (!name || price == null) {
    return res.status(400).json({ error: "Name ve price zorunludur" });
  }

  // Fiyat negatif olamaz
  if (isNaN(price) || price < 0) {
    return res.status(400).json({ error: "Fiyat 0'dan küçük olamaz" });
  }

  // Stok negatif olamaz
  if (isNaN(stock) || stock < 0) {
    return res.status(400).json({ error: "Stok eksi olamaz veya geçersizdir" });
  }

  const productData = {
    name,
    description,
    price,
    image_url,
    stock,
  };

  if (category_id != null) {
    productData.category_id = category_id;
  }

  try {
    const { data, error } = await supabase
      .from("crud")
      .insert([productData])
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

// PUT /api/products/:id/visibility → ürün görünürlüğünü güncelle (mantıksal silmeyle uyumlu)
const updateProductVisibility = async (req, res) => {
  const id = Number(req.params.id);
  const { is_visible } = req.body;

  if (typeof is_visible !== "boolean") {
    return res.status(400).json({ error: "is_visible alanı boolean olmalıdır" });
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
      .update({ is_visible })
      .eq("id", id)
      .select();

    if (error) throw error;

    return res.status(200).json({ message: "Görünürlük güncellendi", product: data[0] });
  } catch (err) {
    console.error("Update product visibility error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// DELETE /api/products/:id → mantıksal silme (is_visible: false)
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
  updateProductVisibility,
  deleteProduct,
};

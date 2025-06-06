const supabase = require("../services/supabase");

// GET /api/categories → tüm kategorileri getir
const getAllCategories = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;
    return res.status(200).json(data);
  } catch (err) {
    console.error("getAllCategories error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// POST /api/categories → yeni kategori ekle (admin)
const createCategory = async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ error: "Kategori adı zorunludur" });
  }

  try {
    const { data, error } = await supabase
      .from("categories")
      .insert([{ name: name.trim() }])
      .select();

    if (error) throw error;
    return res.status(201).json({ message: "Kategori eklendi", category: data[0] });
  } catch (err) {
    console.error("createCategory error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// PUT /api/categories/:id → kategori adı güncelle
const updateCategory = async (req, res) => {
  const id = Number(req.params.id);
  const { name } = req.body;

  if (isNaN(id) || !name) {
    return res.status(400).json({ error: "Geçersiz veri" });
  }

  try {
    const { data, error } = await supabase
      .from("categories")
      .update({ name: name.trim() })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) throw error;

    return res.json({ message: "Kategori güncellendi", category: data });
  } catch (err) {
    console.error("updateCategory error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// DELETE /api/categories/:id → kategori sil (bağlı ürün ve kampanya kontrolüyle)
const deleteCategory = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Geçersiz kategori ID" });
  }

  try {
    // 1. Ürün kontrolü
    const { data: products, error: prodErr } = await supabase
      .from("crud")
      .select("id")
      .eq("category_id", id);

    if (prodErr) throw prodErr;
    if (products.length > 0) {
      return res.status(400).json({ error: "Bu kategoriye bağlı ürün(ler) var, silinemez" });
    }

    // 2. Kampanya ilişkisi kontrolü
    const { data: campaignLinks, error: linkErr } = await supabase
      .from("campaign_categories")
      .select("id")
      .eq("category_id", id);

    if (linkErr) throw linkErr;
    if (campaignLinks.length > 0) {
      return res.status(400).json({
        error: "Bu kategoriye bağlı kampanyalar mevcut. Önce kampanya ilişkilerini kaldırın."
      });
    }

    // 3. Silme işlemi
    const { error: delErr } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (delErr) throw delErr;

    return res.json({ message: "Kategori silindi" });
  } catch (err) {
    console.error("deleteCategory error:", err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
};

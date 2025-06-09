const supabase = require("../supabase");

async function deleteCategory(id) {
  if (!id) throw new Error("Kategori ID gerekli");

  // 1. Kategori var mı?
  const { data: existing, error: fetchError } = await supabase
    .from("categories")
    .select("id")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !existing) {
    throw new Error("Silinecek kategori bulunamadı");
  }

  // 2. Bağlı ürün var mı?
  const { data: products, error: prodErr } = await supabase
    .from("crud")
    .select("id")
    .eq("category_id", id)
    .limit(1);

  if (prodErr) throw prodErr;
  if (products && products.length > 0) {
    throw new Error("Bu kategoriye bağlı ürünler olduğu için silinemez");
  }

  // 3. Silme işlemi
  const { error: deleteErr } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (deleteErr) {
    throw new Error("Kategori silinemedi");
  }

  return { message: "Kategori başarıyla silindi", deletedId: id };
}

module.exports = deleteCategory;

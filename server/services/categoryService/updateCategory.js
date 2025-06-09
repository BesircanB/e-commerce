const supabase = require("../supabase");
const {
  validateCategoryInput,
  sanitizeCategoryInput,
} = require("../../utils/categoryHelpers");

async function updateCategory(id, input) {
  if (!id) throw new Error("Kategori ID gerekli");

  // 1. Giriş doğrulama
  const { error } = validateCategoryInput(input);
  if (error) throw new Error(error);

  // 2. Temizleme
  const data = sanitizeCategoryInput(input);

  // 3. Aynı isimde başka kategori var mı?
  const { data: existing, error: existsErr } = await supabase
    .from("categories")
    .select("id")
    .eq("name", data.name)
    .neq("id", id)
    .maybeSingle();

  if (existsErr) throw existsErr;
  if (existing) throw new Error("Bu isimde başka bir kategori zaten var");

  // 4. Güncelleme işlemi
  const { data: updated, error: updateErr } = await supabase
    .from("categories")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (updateErr || !updated) {
    throw new Error("Kategori güncellenemedi");
  }

  return updated;
}

module.exports = updateCategory;

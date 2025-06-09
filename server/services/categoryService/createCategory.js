const supabase = require("../supabase");
const {
  validateCategoryInput,
  sanitizeCategoryInput,
} = require("../../utils/categoryHelpers");

async function createCategory(input) {
  // 1. Doğrulama
  const { error } = validateCategoryInput(input);
  if (error) throw new Error(error);

  // 2. Temizleme
  const data = sanitizeCategoryInput(input);

  // 3. Aynı adla kategori var mı?
  const { data: existing, error: existsErr } = await supabase
    .from("categories")
    .select("id")
    .eq("name", data.name)
    .maybeSingle();

  if (existsErr) throw existsErr;
  if (existing) throw new Error("Bu isimde bir kategori zaten var");

  // 4. Kategori oluştur
  const { data: created, error: insertErr } = await supabase
    .from("categories")
    .insert(data)
    .select()
    .single();

  if (insertErr || !created) {
    throw new Error("Kategori oluşturulamadı");
  }

  return created;
}

module.exports = createCategory;

const supabase = require("../supabase");

async function getAllCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    throw new Error("Kategoriler getirilemedi");
  }

  return data;
}

module.exports = getAllCategories;

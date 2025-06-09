const supabase = require("../supabase");

async function deleteCampaign(id) {
  if (!id) {
    throw new Error("Kampanya ID gerekli");
  }

  // 1. Kampanya var mı?
  const { data: existing, error: fetchError } = await supabase
    .from("campaigns")
    .select("id", { count: "exact" })
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !existing) {
    throw new Error("Silinecek kampanya bulunamadı");
  }

  // 2. Silme işlemi
  const { error: deleteError } = await supabase
    .from("campaigns")
    .delete()
    .eq("id", id);

  if (deleteError) {
    throw new Error("Kampanya silinemedi");
  }

  // 3. Cascade ile ilişkili category eşleşmeleri de silinir
  return {
    message: `Kampanya başarıyla silindi.`,
    deletedId: id,
  };
}

module.exports = deleteCampaign;

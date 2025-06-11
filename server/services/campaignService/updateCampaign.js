const supabase = require("../supabase");
const { supabaseAdmin } = require("../supabase");
const {
  validateCampaignInput,
  sanitizeCampaignInput,
} = require("../../utils/campaignHelpers");

async function updateCampaign(id, input) {
  if (!id) {
    throw new Error("Kampanya ID gerekli");
  }

  // 1. Giriş doğrulama
  const { error } = validateCampaignInput(input);
  if (error) throw new Error(error);

  // 2. Temiz veri
  const cleanData = sanitizeCampaignInput(input);
  const { category_ids, tag_ids, ...campaignData } = cleanData;

  // 3. Kampanya mevcut mu?
  const { data: existing, error: existingError } = await supabase
    .from("campaigns")
    .select("id")
    .eq("id", id)
    .maybeSingle();

  if (existingError || !existing) {
    throw new Error("Güncellenecek kampanya bulunamadı");
  }

  // 4. Kampanya güncelle
  const { data: updated, error: updateError } = await supabase
    .from("campaigns")
    .update(campaignData)
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    throw new Error("Kampanya güncellenemedi");
  }

  // 5. Kategori ilişkilerini güncelle
  if (Array.isArray(category_ids)) {
    // Önce eski ilişkileri sil
    await supabaseAdmin.from("campaign_categories").delete().eq("campaign_id", id);
    // Sonra yeni ilişkileri ekle
    if (category_ids.length > 0) {
      const categoryRows = category_ids.map((catId) => ({
        campaign_id: id,
        category_id: catId,
      }));
      await supabaseAdmin.from("campaign_categories").insert(categoryRows);
    }
  }

  // 6. Etiket ilişkilerini güncelle
  if (Array.isArray(tag_ids)) {
    // Önce eski ilişkileri sil
    await supabaseAdmin.from("campaign_tags").delete().eq("campaign_id", id);
    // Sonra yeni ilişkileri ekle
    if (tag_ids.length > 0) {
      const tagRows = tag_ids.map((tagId) => ({
        campaign_id: id,
        tag_id: tagId,
      }));
      await supabaseAdmin.from("campaign_tags").insert(tagRows);
    }
  }

  // 7. Güncel kategori ve tag id'lerini çek
  const { data: catRows } = await supabase
    .from("campaign_categories")
    .select("category_id")
    .eq("campaign_id", id);
  const { data: tagRows } = await supabase
    .from("campaign_tags")
    .select("tag_id")
    .eq("campaign_id", id);

  return {
    ...updated,
    category_ids: catRows ? catRows.map(row => row.category_id) : [],
    tag_ids: tagRows ? tagRows.map(row => row.tag_id) : [],
  };
}

module.exports = updateCampaign;

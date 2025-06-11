const supabase = require("../supabase");
const { supabaseAdmin } = require("../supabase");
const {
  validateCampaignInput,
  sanitizeCampaignInput,
} = require("../../utils/campaignHelpers");

async function createCampaign(input) {
  // 1. Giriş validasyonu
  const { error } = validateCampaignInput(input);
  if (error) {
    throw new Error(error);
  }

  // 2. Temiz veri
  const data = sanitizeCampaignInput(input);
  const { category_ids, tag_ids, ...campaignData } = data;

  // 3. Aynı kod var mı?
  const { data: existing, error: existingError } = await supabase
    .from("campaigns")
    .select("id")
    .eq("code", campaignData.code)
    .maybeSingle();

  if (existingError) throw existingError;
  if (existing) throw new Error("Bu kampanya kodu zaten kullanılıyor");

  // 4. Kampanya ekle
  const { data: newCampaign, error: insertError } = await supabase
    .from("campaigns")
    .insert(campaignData)
    .select()
    .single();

  if (insertError) {
    throw new Error("Kampanya oluşturulamadı");
  }

  // 5. Kategori ilişkileri ekle
  if (category_ids && category_ids.length > 0) {
    const categoryRows = category_ids.map((catId) => ({
      campaign_id: newCampaign.id,
      category_id: catId,
    }));
    await supabaseAdmin.from("campaign_categories").insert(categoryRows);
  }

  // 6. Etiket ilişkileri ekle (eğer tag_ids varsa ve tablo varsa)
  if (tag_ids && tag_ids.length > 0) {
    const tagRows = tag_ids.map((tagId) => ({
      campaign_id: newCampaign.id,
      tag_id: tagId,
    }));
    await supabaseAdmin.from("campaign_tags").insert(tagRows);
  }

  return newCampaign;
}

module.exports = createCampaign;

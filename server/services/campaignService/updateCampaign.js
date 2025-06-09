const supabase = require("../supabase");
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

  // 3. Kampanya mevcut mu?
  const { data: existing, error: existingError } = await supabase
    .from("campaigns")
    .select("id")
    .eq("id", id)
    .maybeSingle();

  if (existingError || !existing) {
    throw new Error("Güncellenecek kampanya bulunamadı");
  }

  // 4. Güncelleme
  const { data: updated, error: updateError } = await supabase
    .from("campaigns")
    .update(cleanData)
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    throw new Error("Kampanya güncellenemedi");
  }

  return updated;
}

module.exports = updateCampaign;

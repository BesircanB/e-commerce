const supabase = require("../supabase");
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

  // 3. Aynı kod var mı?
  const { data: existing, error: existingError } = await supabase
    .from("campaigns")
    .select("id")
    .eq("code", data.code)
    .maybeSingle();

  if (existingError) throw existingError;
  if (existing) throw new Error("Bu kampanya kodu zaten kullanılıyor");

  // 4. Ekleme işlemi
  const { data: newCampaign, error: insertError } = await supabase
    .from("campaigns")
    .insert(data)
    .select()
    .single();

  if (insertError) {
    throw new Error("Kampanya oluşturulamadı");
  }

  return newCampaign;
}

module.exports = createCampaign;

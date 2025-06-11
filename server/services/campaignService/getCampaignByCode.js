const supabase = require("../supabase");

async function getCampaignByCode(code) {
  if (!code || typeof code !== "string") {
    throw new Error("Geçerli bir kampanya kodu giriniz");
  }

  // Sadece kodu normalize et
  const trimmedCode = code.trim().toUpperCase();
  const now = new Date().toISOString();

  const { data: campaign, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("code", trimmedCode)
    .eq("is_active", true)
    .lte("start_date", now)
    .gte("end_date", now)
    .single();

  if (error || !campaign) {
    throw new Error("Geçerli veya aktif bir kampanya bulunamadı");
  }

  return campaign;
}

module.exports = getCampaignByCode;

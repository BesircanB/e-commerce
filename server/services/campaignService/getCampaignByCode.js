const supabase = require("../supabase");

async function getCampaignByCode(code) {
  if (!code || typeof code !== "string") {
    throw new Error("Geçerli bir kampanya kodu giriniz");
  }

  const trimmedCode = code.trim().toUpperCase();

  const { data: campaign, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("code", trimmedCode)
    .eq("is_active", true)
    .lte("expires_at", new Date().toISOString()) // süresi geçmişse dahil etme
    .single();

  if (error || !campaign) {
    throw new Error("Geçerli veya aktif bir kampanya bulunamadı");
  }

  return campaign;
}

module.exports = getCampaignByCode;

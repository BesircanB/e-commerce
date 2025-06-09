const supabase = require("../supabase");

async function toggleCampaignStatus(id, isActive) {
  if (!id) {
    throw new Error("Kampanya ID gerekli");
  }

  if (typeof isActive !== "boolean") {
    throw new Error("Geçerli bir aktiflik değeri gönderin (true/false)");
  }

  const { data: updated, error } = await supabase
    .from("campaigns")
    .update({ is_active: isActive })
    .eq("id", id)
    .select()
    .single();

  if (error || !updated) {
    throw new Error("Kampanya durumu güncellenemedi");
  }

  return updated;
}

module.exports = toggleCampaignStatus;

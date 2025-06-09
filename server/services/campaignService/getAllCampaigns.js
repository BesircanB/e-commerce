const supabase = require("../supabase");

async function getAllCampaigns({ onlyActive = false } = {}) {
  let query = supabase.from("campaigns").select("*");

  if (onlyActive) {
    query = query.eq("is_active", true);
  }

  const { data: campaigns, error } = await query.order("created_at", {
    ascending: false,
  });

  if (error) {
    throw new Error("Kampanyalar getirilemedi");
  }

  return campaigns;
}

module.exports = getAllCampaigns;

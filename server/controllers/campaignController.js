const supabase = require("../services/supabase");

// GET /api/campaigns → aktif kampanyaları getir
const getActiveCampaigns = async (req, res) => {
  try {
    const today = new Date().newDate();

    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .lte("start_date", today)
      .gte("end_date", today)
      .eq("is_active", true);

    if (error) throw error;

    return res.status(200).json(data);
  } catch (err) {
    console.error("getActiveCampaigns error:", err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getActiveCampaigns,
};

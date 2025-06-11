const supabase = require("../supabase");
const { groupRevenueByMonth } = require("../../utils/financeHelpers");

async function fetchMonthlyRevenue() {
  const { data: orders, error } = await supabase
    .from("orders")
    .select("final_total, status, created_at");

  if (error) throw error;

  return groupRevenueByMonth(orders);
}

module.exports = fetchMonthlyRevenue;

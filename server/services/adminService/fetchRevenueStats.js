const supabase = require("../../supabase");
const { calculateTax, calculateNetRevenue } = require("../../utils/financeHelpers");

async function fetchRevenueStats() {
  const { data: orders, error } = await supabase
    .from("orders")
    .select("final_total, status");

  if (error) throw error;

  const paidOrders = orders.filter(order => order.status === "paid");
  const netRevenue = calculateNetRevenue(paidOrders);
  const estimatedTax = calculateTax(netRevenue);
  const grossRevenue = netRevenue + estimatedTax;

  return {
    netRevenue,
    estimatedTax,
    grossRevenue,
  };
}

module.exports = fetchRevenueStats;

// Ek olarak bu fonksiyonu ekliyoruz:
function groupRevenueByMonth(orders) {
  const monthMap = {};

  orders.forEach(order => {
    if (order.status !== "paid") return;

    const date = new Date(order.created_at);
    const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;

    if (!monthMap[month]) {
      monthMap[month] = 0;
    }

    monthMap[month] += order.final_total || 0;
  });

  return Object.entries(monthMap)
    .map(([month, total]) => ({ month, total }))
    .sort((a, b) => new Date(a.month) - new Date(b.month));
}

module.exports = {
  calculateTax,
  calculateNetRevenue,
  groupRevenueByMonth
};

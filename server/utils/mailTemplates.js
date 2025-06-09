function getOrderConfirmationText(order, user) {
  return `
Sayın ${user.name},

Siparişiniz başarıyla alındı.

Sipariş No: ${order.id}
Toplam: ${order.final_total} TL
Durum: ${order.status}

Teşekkür ederiz.
`;
}

function getOrderConfirmationHtml(order, user) {
  return `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2>Merhaba ${user.name},</h2>
    <p>Siparişiniz başarıyla alındı.</p>
    <ul>
      <li><strong>Sipariş No:</strong> ${order.id}</li>
      <li><strong>Toplam:</strong> ${order.final_total} TL</li>
      <li><strong>Durum:</strong> ${order.status}</li>
    </ul>
    <p>İlginiz için teşekkür ederiz.</p>
  </div>
  `;
}

module.exports = {
  getOrderConfirmationText,
  getOrderConfirmationHtml,
};

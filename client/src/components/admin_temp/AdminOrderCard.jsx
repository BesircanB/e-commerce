import React from "react";
import { useAdminOrders } from "../../context/AdminOrdersContext";

const AdminOrderCard = ({ order }) => {
  const { updateOrderStatus } = useAdminOrders();

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    updateOrderStatus(order.id, newStatus);
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "1rem",
        marginBottom: "1.5rem",
        backgroundColor: "#fdfdfd",
      }}
    >
      <h4 style={{ marginBottom: "0.5rem" }}>
        Sipariş #{order.id} – {order.user?.name || "Kullanıcı Yok"}
      </h4>
      <p>
        <strong>Tutar:</strong> {order.total_amount.toFixed(2)} ₺
      </p>
      <p>
        <strong>Tarih:</strong>{" "}
        {new Date(order.created_at).toLocaleString("tr-TR")}
      </p>

      <div style={{ marginTop: "0.5rem" }}>
        <label htmlFor={`status-${order.id}`}>Durum: </label>
        <select
          id={`status-${order.id}`}
          value={order.status}
          onChange={handleStatusChange}
        >
          <option value="hazırlanıyor">Hazırlanıyor</option>
          <option value="kargoya verildi">Kargoya Verildi</option>
          <option value="teslim edildi">Teslim Edildi</option>
          <option value="iptal edildi">İptal Edildi</option>
        </select>
      </div>

      <hr style={{ margin: "1rem 0" }} />

      <ul>
        {order.order_items?.map((item) => (
          <li key={item.id}>
            {item.product?.name} – {item.quantity} adet –{" "}
            {(item.product?.price * item.quantity).toFixed(2)} ₺
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminOrderCard;

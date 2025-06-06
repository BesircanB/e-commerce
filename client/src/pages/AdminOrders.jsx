import React, { useState } from "react";
import { useAdminOrders } from "../context/AdminOrdersContext";
import { useAuth } from "../context/AuthContext";
import axios from "../services/axiosInstance";
import Header from "../components/Header";

const AdminOrders = () => {
  const { orders, loading, refetch } = useAdminOrders();
  const { token } = useAuth();

  const [statusMap, setStatusMap] = useState({}); // orderId -> selected status

  const handleStatusChange = (orderId, newStatus) => {
    setStatusMap((prev) => ({ ...prev, [orderId]: newStatus }));
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`/orders/${orderId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Durum başarıyla güncellendi.");
      refetch(); // Siparişleri tekrar çek
    } catch (err) {
      console.error("Durum güncelleme hatası:", err);
      alert("Güncelleme başarısız: " + (err.response?.data?.error || ""));
    }
  };

  if (loading) return <p>Yükleniyor...</p>;
  if (orders.length === 0) return <p>Hiç sipariş bulunamadı.</p>;

  return (
    <>
      <Header />
      <div style={{ padding: "2rem" }}>
        <h2>📦 Admin Siparişler</h2>
        <button onClick={refetch} style={{ marginBottom: "1rem" }}>🔄 Yenile</button>

        {orders.map((order) => (
          <div
            key={order.id}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              marginBottom: "1rem",
              borderRadius: "6px"
            }}
          >
            <p><strong>👤 Kullanıcı:</strong> {order.user?.name || "Anonim"} ({order.user?.email || "?"})</p>
            <p><strong>🕒 Tarih:</strong> {new Date(order.created_at).toLocaleString()}</p>
            <p><strong>💳 Tutar:</strong> ₺{order.total_amount}</p>
            <p><strong>📌 Durum:</strong> {order.status}</p>

            <div style={{ marginTop: "0.5rem" }}>
              <strong>🛒 Ürünler:</strong>
              <ul>
                {order.order_items?.map(item => (
                  <li key={item.id}>
                    {item.product?.name || "Ürün"} — {item.quantity} adet — ₺{item.unit_price}
                  </li>
                ))}
              </ul>
            </div>

            {/* 🛠️ Durum Güncelleme */}
            <div style={{ marginTop: "1rem" }}>
              <label><strong>🛠 Durumu Güncelle:</strong></label>
              <select
                value={statusMap[order.id] || order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                style={{ marginLeft: "0.5rem" }}
              >
                <option value="pending">Bekliyor</option>
                <option value="preparing">Hazırlanıyor</option>
                <option value="shipped">Kargoda</option>
                <option value="delivered">Teslim Edildi</option>
                <option value="cancelled">İptal Edildi</option>
              </select>
              <button
                onClick={() => updateOrderStatus(order.id, statusMap[order.id] || order.status)}
                style={{ marginLeft: "1rem" }}
              >
                💾 Kaydet
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AdminOrders;

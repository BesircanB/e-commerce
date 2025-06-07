import React from "react";
import { useAdminOrders } from "../context/AdminOrdersContext";
import AdminOrderCard from "../components/admin_temp/AdminOrderCard";
import Header from "../components/Header/Header"; // ✅ Eklendi

const AdminOrders = () => {
  const { orders, loading, refetch } = useAdminOrders();

  if (loading) return <><Header /><p style={{ padding: "2rem" }}>Yükleniyor...</p></>;

  return (
    <>
      <Header /> {/* ✅ Eklendi */}
      <div style={{ padding: "2rem" }}>
        <h2>Admin Siparişler</h2>
        <button onClick={refetch} style={buttonStyle}>🔄 Yenile</button>

        {orders.length === 0 ? (
          <p>Hiç sipariş bulunamadı.</p>
        ) : (
          orders.map((order) => (
            <AdminOrderCard key={order.id} order={order} />
          ))
        )}
      </div>
    </>
  );
};

const buttonStyle = {
  marginBottom: "1.5rem",
  padding: "0.5rem 1rem",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default AdminOrders;

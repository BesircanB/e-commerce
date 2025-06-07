import React from "react";
import Header from "../components/Header/Header";
import { useOrders } from "../context/OrderContext";

const OrdersPage = () => {
  const { orders, cancelOrder } = useOrders();

  return (
    <div>
      <Header />
      <div style={{ padding: "2rem" }}>
        <h2>Sipariş Geçmişi</h2>

        {orders.length === 0 ? (
          <p>Henüz bir siparişiniz bulunmamaktadır.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                marginBottom: "1.5rem",
                borderRadius: "6px",
              }}
            >
              <p><strong>Sipariş ID:</strong> {order.id}</p>
              <p><strong>Tarih:</strong> {new Date(order.created_at).toLocaleString()}</p>
              <p><strong>Toplam:</strong> {order.total_amount.toFixed(2)} ₺</p>
              <p><strong>Durum:</strong> {order.status}</p>

              <h4>Ürünler:</h4>
              <ul>
                {order.order_items.map((item) => (
                  <li key={item.id}>
                    {item.product?.name || "Ürün yok"} × {item.quantity} ={" "}
                    {(item.unit_price * item.quantity).toFixed(2)} ₺
                  </li>
                ))}
              </ul>

              {["pending", "paid"].includes(order.status) && (
                <button
                  onClick={() => cancelOrder(order.id)}
                  style={{
                    marginTop: "1rem",
                    backgroundColor: "#dc3545",
                    color: "white",
                    padding: "0.5rem 1rem",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Siparişi İptal Et
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersPage;

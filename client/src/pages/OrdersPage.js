import React from "react";
import Header from "../components/Header";
import { useOrders } from "../context/OrderContext";

const OrdersPage = () => {
  const { orders } = useOrders();

  return (
    <div>
      <Header />
      <div style={{ padding: "2rem" }}>
        <h2>Sipariş Geçmişi</h2>

        {orders.length === 0 ? (
          <p>Henüz bir siparişiniz bulunmamaktadır.</p>
        ) : (
          orders.map((order, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                marginBottom: "1.5rem",
                borderRadius: "6px",
              }}
            >
              <p><strong>Sipariş Tarihi:</strong> {new Date(order.date).toLocaleString()}</p>
              <p><strong>Toplam:</strong> {order.total.toFixed(2)} ₺</p>
              <p><strong>Adres:</strong> {order.address}</p>
              <p><strong>Telefon:</strong> {order.phone}</p>

              <h4>Ürünler:</h4>
              <ul>
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.title} × {item.quantity} = {(item.price * item.quantity).toFixed(2)} ₺
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersPage;

import React from "react";
import Header from "../components/Header";
import mockOrders from "../models/mockOrders";

const OrdersPage = () => {
  return (
    <div>
      <Header />
      <div style={{ padding: "2rem" }}>
        <h2>Sipariş Geçmişim</h2>

        {mockOrders.length === 0 ? (
          <p>Henüz bir siparişiniz yok.</p>
        ) : (
          mockOrders.map((order) => {
            const total = order.items.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            );

            return (
              <div key={order.id} style={{ borderBottom: "1px solid #ccc", padding: "1rem 0" }}>
                <h4>Sipariş Tarihi: {order.date}</h4>
                <ul>
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.title} x {item.quantity} ={" "}
                      {(item.price * item.quantity).toFixed(2)} ₺
                    </li>
                  ))}
                </ul>
                <strong>Toplam: {total.toFixed(2)} ₺</strong>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default OrdersPage;

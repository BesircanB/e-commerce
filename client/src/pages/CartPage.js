import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    applyCampaign,
    campaigns,
    total,
  } = useCart();

  const { placeOrder } = useOrders();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApplyCoupon = async () => {
    const result = await applyCampaign(couponCode);
    if (result.success) {
      setMessage("✅ Kupon başarıyla uygulandı.");
    } else {
      setMessage("❌ " + result.message);
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    const result = await placeOrder();
    setLoading(false);
    if (result.success) {
      navigate("/orders");
    } else {
      alert("Sipariş oluşturulamadı: " + result.message);
    }
  };

  const originalTotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div>
      <Header />

      <div style={{ padding: "2rem" }}>
        <h2>Sepetim</h2>

        {cartItems.length === 0 ? (
          <p>Sepetiniz boş.</p>
        ) : (
          <>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  style={{
                    borderBottom: "1px solid #ccc",
                    padding: "1rem 0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong>{item.product.name}</strong>
                    <p>
                      {item.product.price} ₺ x {item.quantity} ={" "}
                      {(item.product.price * item.quantity).toFixed(2)} ₺
                    </p>

                    <div>
                      <button onClick={() => decreaseQuantity(item.id)}>➖</button>
                      <button onClick={() => increaseQuantity(item.id)}>➕</button>
                    </div>
                  </div>

                  <button onClick={() => removeFromCart(item.id)}>Kaldır</button>
                </li>
              ))}
            </ul>

            {/* 🧾 Kampanya kodu */}
            <div style={{ marginTop: "2rem" }}>
              <input
                type="text"
                placeholder="Kupon Kodu Giriniz"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                style={{ padding: "0.5rem", marginRight: "0.5rem" }}
              />
              <button onClick={handleApplyCoupon}>Uygula</button>
              {message && <p>{message}</p>}
            </div>

            {/* 🎁 Uygulanan Kampanyalar */}
            {campaigns && (
              <div style={{ marginTop: "1rem" }}>
                {campaigns.auto?.length > 0 && (
                  <>
                    <h4>Otomatik Kampanyalar:</h4>
                    <ul>
                      {campaigns.auto.map((camp, index) => (
                        <li key={index}>
                          {camp.title} - {camp.amount.toFixed(2)} ₺
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {campaigns.code && (
                  <p>
                    ✔ Kupon: <strong>{campaigns.code.code}</strong> –{" "}
                    {campaigns.code.amount.toFixed(2)} ₺
                  </p>
                )}
              </div>
            )}

            {/* 💰 Toplam */}
            <div style={{ marginTop: "2rem", fontWeight: "bold" }}>
              <p>Ara Toplam: {originalTotal.toFixed(2)} ₺</p>
              <p>İndirimli Toplam: {total.toFixed(2)} ₺</p>
            </div>

            <button onClick={clearCart} style={{ marginTop: "1rem" }}>
              Sepeti Temizle
            </button>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              style={{
                marginTop: "1rem",
                backgroundColor: "#28a745",
                color: "white",
                padding: "0.5rem 1rem",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {loading ? "Sipariş oluşturuluyor..." : "Siparişi Tamamla"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;

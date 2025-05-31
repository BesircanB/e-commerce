import React, { useState } from "react";
import { useCart } from "../context/CartContext";
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
    appliedCampaign,
    getCartTotal,
    getDiscountedTotal,
  } = useCart();

  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState("");
  const [message, setMessage] = useState("");

  const handleApplyCoupon = () => {
    const result = applyCampaign(couponCode);
    if (result.success) {
      setMessage("✅ Kupon başarıyla uygulandı.");
    } else {
      setMessage("❌ " + result.message);
    }
  };

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
                    <strong>{item.title}</strong>
                    <p>
                      {item.price} ₺ x {item.quantity} ={" "}
                      {(item.price * item.quantity).toFixed(2)} ₺
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

            {/* 🧾 Kampanya kodu giriş alanı */}
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
              {appliedCampaign && (
                <p style={{ color: "green" }}>
                  ✔ Uygulanan Kampanya: <strong>{appliedCampaign.code}</strong> (
                  {appliedCampaign.type === "percentage"
                    ? `%${appliedCampaign.amount}`
                    : `${appliedCampaign.amount}₺ indirim`}
                  )
                </p>
              )}
            </div>

            {/* 💰 Toplamlar */}
            <div style={{ marginTop: "2rem", fontWeight: "bold" }}>
              <p>Ara Toplam: {getCartTotal().toFixed(2)} ₺</p>
              {appliedCampaign && (
                <p>İndirimli Toplam: {getDiscountedTotal().toFixed(2)} ₺</p>
              )}
              {!appliedCampaign && (
                <p>Toplam: {getCartTotal().toFixed(2)} ₺</p>
              )}
            </div>

            <button onClick={clearCart} style={{ marginTop: "1rem" }}>
              Sepeti Temizle
            </button>

            <button
              onClick={() => navigate("/checkout")}
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
              Siparişi Tamamla
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;

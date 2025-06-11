// src/components/cart/CartTotal.jsx
import React from "react";

const CartTotal = ({
  cartItems,
  total,
  loading,
  onClear,
  onPlaceOrder,
}) => {
  const originalTotal = cartItems.reduce(
    (sum, item) => sum + (item.crud?.price || 0) * item.quantity,
    0
  );

  return (
    <div style={{ marginTop: "2rem" }}>
      <div style={{ fontWeight: "bold" }}>
        <p>Ara Toplam: {originalTotal.toFixed(2)} ₺</p>
        <p>İndirimli Toplam: {total.toFixed(2)} ₺</p>
      </div>

      <button onClick={onClear} style={{ marginTop: "1rem" }}>
        Sepeti Temizle
      </button>

      <button
        onClick={onPlaceOrder}
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
    </div>
  );
};

export default CartTotal;

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
      <ul className="summary-list">
        <li>
          <span>Ara Toplam:</span>
          <span>{originalTotal.toFixed(2)} ₺</span>
        </li>
        <li>
          <span>İndirimli Toplam:</span>
          <span className="summary-total">{total.toFixed(2)} ₺</span>
        </li>
      </ul>

      <button className="cart-action-btn ghost" onClick={onClear}>
        Sepeti Temizle
      </button>

      <button
        className="cart-action-btn primary"
        onClick={onPlaceOrder}
        disabled={loading}
      >
        {loading ? "Sipariş oluşturuluyor..." : "Siparişi Tamamla"}
      </button>
    </div>
  );
};

export default CartTotal;

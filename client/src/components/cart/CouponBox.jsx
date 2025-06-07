// src/components/cart/CouponBox.jsx
import React, { useState } from "react";

const CouponBox = ({ onApply }) => {
  const [couponCode, setCouponCode] = useState("");
  const [message, setMessage] = useState("");

  const handleApply = async () => {
    const result = await onApply(couponCode);
    if (result.success) {
      setMessage("✅ Kupon başarıyla uygulandı.");
    } else {
      setMessage("❌ " + result.message);
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <input
        type="text"
        placeholder="Kupon Kodu Giriniz"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
        style={{ padding: "0.5rem", marginRight: "0.5rem" }}
      />
      <button onClick={handleApply}>Uygula</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CouponBox;

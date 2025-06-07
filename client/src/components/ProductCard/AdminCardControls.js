// components/ProductCard/AdminCardControls.js
import React from "react";

const AdminCardControls = ({ product, onEdit, onDelete, onToggleVisibility }) => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "0.3rem",
      marginTop: "0.5rem",
    }}>
      <button onClick={() => onEdit?.(product)}>✏ Düzenle</button>
      <button onClick={() => onToggleVisibility?.(product.id)}>
        {product.is_visible ? "👁 Gizle" : "👁 Göster"}
      </button>
      <button onClick={() => onDelete?.(product.id)} style={{ color: "red" }}>
        🗑 Sil
      </button>
    </div>
  );
};

export default AdminCardControls;

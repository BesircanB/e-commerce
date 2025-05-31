import React from "react";

const ProductList = ({ products, onDelete, onToggleVisibility, onEdit }) => {
  if (!products || products.length === 0) return <p>Hiç ürün yok.</p>;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
      {products.map((p) => (
        <div key={p.id} style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "1rem",
          background: "#fff",
        }}>
          <img src={p.image} alt={p.title} style={{ width: "100%", height: "150px", objectFit: "cover", marginBottom: "0.5rem" }} />
          <h4>{p.title}</h4>
          <p>{p.description}</p>
          <p><strong>{p.price.toFixed(2)} ₺</strong></p>
          <p><em>Kategori: {p.category}</em></p>
          <p>Gösterim: {p.visible ? "🟢 Açık" : "🔴 Kapalı"}</p>

          <div style={{ marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            <button onClick={() => onEdit(p)}>✏ Düzenle</button>
            <button onClick={() => onToggleVisibility(p.id)}>👁 Göster/Gizle</button>
            <button onClick={() => onDelete(p.id)} style={{ color: "red" }}>🗑 Sil</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;

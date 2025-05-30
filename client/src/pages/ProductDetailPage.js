import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import mockProducts from "../models/mockProducts";
import { useCart } from "../context/CartContext";
import Header from "../components/Header";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const adminStored = localStorage.getItem("admin_products");
    const adminProducts = adminStored ? JSON.parse(adminStored) : [];
    const visibleAdmin = adminProducts.filter((p) => p.visible);
    const combined = [...mockProducts, ...visibleAdmin];

    const found = combined.find((p) => p.id.toString() === id);
    setProduct(found);
  }, [id]);

  if (!product) {
    return (
      <div>
        <Header />
        <p style={{ padding: "2rem" }}>Ürün bulunamadı.</p>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div style={{ padding: "2rem", display: "flex", gap: "2rem" }}>
        <img
          src={product.image}
          alt={product.title}
          style={{ width: "300px", borderRadius: "8px" }}
        />
        <div>
          <h2>{product.title}</h2>
          <p>{product.description || "Ürün açıklaması mevcut değil."}</p>
          <h3>{product.price.toFixed(2)} ₺</h3>
          <button onClick={() => addToCart(product)}>Sepete Ekle</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

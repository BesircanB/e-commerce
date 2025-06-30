import React, { useEffect, useState } from "react";
import axios from "../../services/axiosInstance";
import ProductCard from "../ProductCard/ProductCard";
import "./SimilarProductsSection.css";

const SimilarProductsSection = ({ product }) => {
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!product?.category_id) return;
    setLoading(true);
    axios
      .get(`/products/search?category=${product.category_id}`)
      .then((res) => {
        // Aynı ürünü hariç tut
        setSimilar((res.data || []).filter((p) => p.id !== product.id));
      })
      .finally(() => setLoading(false));
  }, [product]);

  if (loading) return null;
  if (!similar.length) return null;

  return (
    <section className="similar-products-section">
      <h3 className="similar-products-title">Benzer Ürünler</h3>
      <div className="similar-products-grid">
        {similar.slice(0, 6).map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </section>
  );
};

export default SimilarProductsSection; 
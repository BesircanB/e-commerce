import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import "./ProductList.css";
import { useSearch } from "../context/SearchContext";
import mockProducts from "../models/mockProducts";

const ProductList = () => {
  const { searchTerm } = useSearch();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("Tümü");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortOption, setSortOption] = useState("Varsayılan");

  useEffect(() => {
    const stored = localStorage.getItem("admin_products");
    const adminProducts = stored ? JSON.parse(stored) : [];
    const visibleAdmin = adminProducts.filter((p) => p.visible);

    const merged = [...mockProducts, ...visibleAdmin];
    setProducts(merged);
  }, []);

  const filtered = products
    .filter((p) =>
      category === "Tümü" ? true : p.category === category
    )
    .filter((p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((p) => p.price >= minPrice && p.price <= maxPrice)
    .sort((a, b) => {
      if (sortOption === "Artan") return a.price - b.price;
      if (sortOption === "Azalan") return b.price - a.price;
      return 0;
    });

  const categories = ["Tümü", ...new Set(products.map((p) => p.category))];

  return (
    <div style={{ padding: "1rem" }}>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              padding: "0.3rem 0.7rem",
              borderRadius: "5px",
              border: category === cat ? "2px solid green" : "1px solid #ccc",
              background: category === cat ? "#e1f8e8" : "#fff",
              cursor: "pointer",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(Number(e.target.value))}
          placeholder="Min Fiyat"
        />
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          placeholder="Max Fiyat"
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option>Varsayılan</option>
          <option>Artan</option>
          <option>Azalan</option>
        </select>
        <button onClick={() => {
          setCategory("Tümü");
          setMinPrice(0);
          setMaxPrice(10000);
          setSortOption("Varsayılan");
        }}>Filtreleri Temizle</button>
      </div>

      <div className="product-grid">
        {filtered.length > 0 ? (
          filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p style={{ gridColumn: "1 / -1", textAlign: "center" }}>
            Ürün bulunamadı.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductList;

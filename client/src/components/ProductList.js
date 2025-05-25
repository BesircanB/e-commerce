import React, { useState } from "react";
import ProductCard from "./ProductCard";
import "./ProductList.css";
import { useSearch } from "../context/SearchContext";
import mockProducts from "../models/mockProducts";

const ProductList = () => {
  const { searchTerm } = useSearch();
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const categories = ["Tümü", ...new Set(mockProducts.map((p) => p.category))];

  const resetFilters = () => {
    setSelectedCategory("Tümü");
    setMinPrice("");
    setMaxPrice("");
    setSortOrder("");
  };

  const filteredProducts = mockProducts
    .filter((product) =>
      selectedCategory === "Tümü" ? true : product.category === selectedCategory
    )
    .filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) => {
      const min = parseFloat(minPrice) || 0;
      const max = parseFloat(maxPrice) || Infinity;
      return product.price >= min && product.price <= max;
    })
    .sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0;
    });

  return (
    <div className="product-list-container">
      {/* Kategori Butonları */}
      <div className="category-buttons">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`category-btn ${
              selectedCategory === cat ? "active" : ""
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filtre Alanları */}
      <div
        className="price-filter"
        style={{
          marginTop: "1rem",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "2rem",
          flexWrap: "wrap",
        }}
      >
        <label>
          Min Fiyat:
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="0"
            style={{ marginLeft: "0.5rem", width: "80px" }}
          />
        </label>

        <label>
          Max Fiyat:
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="10000"
            style={{ marginLeft: "0.5rem", width: "80px" }}
          />
        </label>

        <label>
          Sırala:
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={{ marginLeft: "0.5rem" }}
          >
            <option value="">Varsayılan</option>
            <option value="asc">Fiyat (Artan)</option>
            <option value="desc">Fiyat (Azalan)</option>
          </select>
        </label>

        <button
          onClick={resetFilters}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#f44336",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Filtreleri Temizle
        </button>
      </div>

      {/* Ürün Listesi */}
      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p style={{ gridColumn: "1 / -1", textAlign: "center" }}>
            Aradığınız kriterlere uygun ürün bulunamadı.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductList;

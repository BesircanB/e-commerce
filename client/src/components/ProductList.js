import React, { useState } from "react";
import ProductCard from "./ProductCard";
import "./ProductList.css";
import { useSearch } from "../context/SearchContext";
import mockProducts from "../models/mockProducts";

const ProductList = () => {
  const { searchTerm } = useSearch();
  const [selectedCategory, setSelectedCategory] = useState("Tümü");

  const categories = ["Tümü", ...new Set(mockProducts.map((p) => p.category))];

  const filteredProducts = mockProducts
    .filter((product) =>
      selectedCategory === "Tümü" ? true : product.category === selectedCategory
    )
    .filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="product-list-container">
      {/* Kategori Butonları */}
      <div className="category-buttons">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`category-btn ${selectedCategory === cat ? "active" : ""}`}
          >
            {cat}
          </button>
        ))}
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

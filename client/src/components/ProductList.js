import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import "./ProductList.css";
import { useSearch } from "../context/SearchContext";
import axios from "../services/axiosInstance";

const ProductList = () => {
  const { searchTerm } = useSearch();

  const [products, setProducts] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortOption, setSortOption] = useState("Varsayılan");

  // Ürünleri çek
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/products");
        setProducts(response.data.data || []);
      } catch (err) {
        console.error("Ürünler alınamadı:", err);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  // Kategorileri çek
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/categories");
        setCategoryList(response.data || []);
      } catch (err) {
        console.error("Kategoriler alınamadı:", err);
        setCategoryList([]);
      }
    };
    fetchCategories();
  }, []);

  const filtered = products
    .filter((p) => selectedCategoryId === null || p.category_id === selectedCategoryId)
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((p) => p.price >= minPrice && p.price <= maxPrice)
    .sort((a, b) => {
      if (sortOption === "Artan") return a.price - b.price;
      if (sortOption === "Azalan") return b.price - a.price;
      return 0;
    });

  return (
    <div style={{ padding: "1rem" }}>
      {/* Kategori Butonları */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        <button
          key="Tümü"
          onClick={() => setSelectedCategoryId(null)}
          style={{
            padding: "0.3rem 0.7rem",
            borderRadius: "5px",
            border: selectedCategoryId === null ? "2px solid green" : "1px solid #ccc",
            background: selectedCategoryId === null ? "#e1f8e8" : "#fff",
            cursor: "pointer",
          }}
        >
          Tümü
        </button>
        {categoryList.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategoryId(c.id)}
            style={{
              padding: "0.3rem 0.7rem",
              borderRadius: "5px",
              border: selectedCategoryId === c.id ? "2px solid green" : "1px solid #ccc",
              background: selectedCategoryId === c.id ? "#e1f8e8" : "#fff",
              cursor: "pointer",
            }}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Filtreleme Paneli */}
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
          setSelectedCategoryId(null);
          setMinPrice(0);
          setMaxPrice(10000);
          setSortOption("Varsayılan");
        }}>Filtreleri Temizle</button>
      </div>

      {/* Ürünler */}
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

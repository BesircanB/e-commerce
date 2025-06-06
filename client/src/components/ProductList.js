import React, { useEffect, useState, useCallback } from "react";
import ProductCard from "./ProductCard";
import "./ProductList.css";
import { useSearch } from "../context/SearchContext";
import { useAuth } from "../context/AuthContext";
import axios from "../services/axiosInstance";

const ProductList = ({ selectedCategoryId: propCategoryId = null }) => {
  const { searchTerm } = useSearch();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [products, setProducts] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(propCategoryId);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortOption, setSortOption] = useState("Varsayılan");

  const fetchProducts = useCallback(async () => {
    try {
      const endpoint = isAdmin ? "/products/admin/all" : "/products";
      const response = await axios.get(endpoint);
      setProducts(response.data.data || []);
    } catch (err) {
      console.error("Ürünler alınamadı:", err);
      setProducts([]);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (propCategoryId !== null) {
      setSelectedCategoryId(propCategoryId);
    }
  }, [propCategoryId]);

  const filtered = products
    .filter((p) => isAdmin || p.is_visible)
    .filter((p) => selectedCategoryId === null || p.category_id === selectedCategoryId)
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((p) => p.price >= minPrice && p.price <= maxPrice)
    .sort((a, b) => {
      if (sortOption === "Artan") return a.price - b.price;
      if (sortOption === "Azalan") return b.price - a.price;
      return 0;
    });

  const handleEdit = (product) => {
    console.log("Düzenle", product);
  };

  const handleDelete = (id) => {
    console.log("Sil", id);
  };

  const handleToggleVisibility = (id) => {
    console.log("Görünürlük değiştir", id);
  };

  return (
    <div style={{ padding: "1rem" }}>
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
        <button
          onClick={() => {
            // ✅ Kategori filtreleme prop olarak geliyorsa onu silme!
            if (!propCategoryId) {
              setSelectedCategoryId(null);
            }
            setMinPrice(0);
            setMaxPrice(10000);
            setSortOption("Varsayılan");
          }}
        >
          Filtreleri Temizle
        </button>
      </div>

      {/* Ürünler */}
      <div className="product-grid">
        {filtered.length > 0 ? (
          filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={isAdmin ? handleEdit : undefined}
              onDelete={isAdmin ? handleDelete : undefined}
              onToggleVisibility={isAdmin ? handleToggleVisibility : undefined}
            />
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

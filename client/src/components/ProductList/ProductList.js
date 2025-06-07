// components/ProductList/ProductList.js
import React, { useEffect, useState } from "react";
import { useSearch } from "../../context/SearchContext";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext"; // ✅ context'ten veri
import "./ProductList.css";

import FilterPanel from "./FilterPanel";
import ProductGrid from "./ProductGrid";

const ProductList = ({ selectedCategoryId: propCategoryId = null }) => {
  const { searchTerm } = useSearch();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const { products, loading, fetchProducts } = useProducts();

  const [selectedCategoryId, setSelectedCategoryId] = useState(propCategoryId);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortOption, setSortOption] = useState("Varsayılan");

  useEffect(() => {
    fetchProducts(isAdmin); // ✅ kullanıcı tipine göre fetch
  }, [fetchProducts, isAdmin]);

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

  const handleResetFilters = () => {
    if (!propCategoryId) setSelectedCategoryId(null);
    setMinPrice(0);
    setMaxPrice(10000);
    setSortOption("Varsayılan");
  };

  const handleEdit = (product) => console.log("Düzenle", product);
  const handleDelete = (id) => console.log("Sil", id);
  const handleToggleVisibility = (id) => console.log("Görünürlük değiştir", id);

  if (loading) return <p style={{ padding: "2rem" }}>Ürünler yükleniyor...</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <FilterPanel
        minPrice={minPrice}
        maxPrice={maxPrice}
        sortOption={sortOption}
        onMinPriceChange={setMinPrice}
        onMaxPriceChange={setMaxPrice}
        onSortChange={setSortOption}
        onResetFilters={handleResetFilters}
      />

      <ProductGrid
        products={filtered}
        isAdmin={isAdmin}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleVisibility={handleToggleVisibility}
      />
    </div>
  );
};

export default ProductList;

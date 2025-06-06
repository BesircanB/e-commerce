import React, { useState } from "react";
import Header from "../components/Header";
import ProductForm from "../components/admin/ProductForm";
import EditProductModal from "../components/admin/EditProductModal";
import { useAdmin } from "../context/AdminContext";
import { useCategories } from "../context/CategoryContext"; // ✅ eklendi
import { useSearch } from "../context/SearchContext";
import ProductCard from "../components/ProductCard";
import CategoryManager from "../components/admin/CategoryManager"; // ✅ eklendi

const AdminPage = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleVisibility,
  } = useAdmin();

  const { categories: categoryList } = useCategories(); // ✅ tüm kategori verileri
  const { searchTerm } = useSearch();

  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortOption, setSortOption] = useState("Varsayılan");

  const filtered = products
    .filter((p) => selectedCategoryId === null || p.category_id === selectedCategoryId)
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((p) => p.price >= minPrice && p.price <= maxPrice)
    .sort((a, b) => {
      if (sortOption === "Artan") return a.price - b.price;
      if (sortOption === "Azalan") return b.price - a.price;
      return 0;
    });

  const handleEditSave = (updatedProduct) => {
    updateProduct(updatedProduct);
    setEditingProduct(null);
  };

  const categories = [...new Set(products.map((p) => p.category_id))];

  return (
    <>
      <Header />
      <div style={{ padding: "2rem" }}>
        <h2>👮 Admin Panel</h2>

        {/* Ürün Ekleme */}
        <ProductForm onAdd={addProduct} />

        <h3>Ürünler</h3>

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
          {categories.map((catId) => {
            const cat = categoryList.find((c) => c.id === catId);
            const label = cat ? cat.name : `Kategori ${catId}`;
            return (
              <button
                key={catId}
                onClick={() => setSelectedCategoryId(catId)}
                style={{
                  padding: "0.3rem 0.7rem",
                  borderRadius: "5px",
                  border: selectedCategoryId === catId ? "2px solid green" : "1px solid #ccc",
                  background: selectedCategoryId === catId ? "#e1f8e8" : "#fff",
                  cursor: "pointer",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Filtreleme */}
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

        {/* Ürün Listesi */}
        <div className="product-grid">
          {filtered.length > 0 ? (
            filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={setEditingProduct}
                onDelete={deleteProduct}
                onToggleVisibility={(id) => toggleVisibility(id, product.is_visible)}
              />
            ))
          ) : (
            <p style={{ gridColumn: "1 / -1", textAlign: "center" }}>
              Ürün bulunamadı.
            </p>
          )}
        </div>

        {/* Kategori Yönetimi Paneli */}
        <hr style={{ margin: "3rem 0" }} />
        <CategoryManager />
      </div>

      {/* Ürün Düzenleme Modalı */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onSave={handleEditSave}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </>
  );
};

export default AdminPage;

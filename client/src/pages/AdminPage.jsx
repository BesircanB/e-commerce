import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import ProductForm from "../components/admin/ProductForm";
import ProductList from "../components/admin/ProductList";
import EditProductModal from "../components/admin/EditProductModal";

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("admin_products");
    try {
      const parsed = stored ? JSON.parse(stored) : [];
      setProducts(parsed);
    } catch (err) {
      console.error("admin_products JSON parse hatası:", err);
      setProducts([]);
    }
  }, []);

  useEffect(() => {
    if (products && products.length > 0) {
      localStorage.setItem("admin_products", JSON.stringify(products));
    }
  }, [products]);

  const handleAddProduct = (formData) => {
    const newProduct = {
      id: Date.now(),
      title: formData.name,
      price: parseFloat(formData.price),
      image: formData.image || "https://via.placeholder.com/300x200.png?text=Ürün",
      description: formData.description,
      category: formData.category,
      visible: formData.visible,
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  const handleDelete = (id) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
  };

  const handleToggleVisibility = (id) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, visible: !p.visible } : p
    );
    setProducts(updated);
  };

  const handleEditProduct = (updatedProduct) => {
    const updated = products.map((p) =>
      p.id === updatedProduct.id ? updatedProduct : p
    );
    setProducts(updated);
  };

  return (
    <>
      <Header />
      <div style={{ padding: "2rem" }}>
        <h2>👮 Admin Panel</h2>
        <ProductForm onAdd={handleAddProduct} />
        <h3>Ürünler</h3>
        <ProductList
          products={products}
          onDelete={handleDelete}
          onToggleVisibility={handleToggleVisibility}
          onEdit={(product) => setEditingProduct(product)}
        />
      </div>

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onSave={handleEditProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </>
  );
};

export default AdminPage;

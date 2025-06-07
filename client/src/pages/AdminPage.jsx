import React from "react";

// Yeni context hook'ları
import { useAdminUI } from "../context/AdminUIContext";

// Bileşenler
import Header from "../components/Header/Header";
import ProductForm from "../components/admin_temp/ProductForm";
import AdminProductHeader from "../components/admin_temp/AdminProductHeader";
import AdminProductFilters from "../components/admin_temp/AdminProductFilters";
import AdminProductGrid from "../components/admin_temp/AdminProductGrid";
import CategoryManager from "../components/admin_temp/CategoryManager";

const AdminPage = () => {
  const { editingProduct, showForm, setShowForm } = useAdminUI();

  return (
    <>
      <Header />
      <div style={{ padding: "2rem" }}>
        <h2>Ürün Yönetimi</h2>
        <AdminProductHeader onAddClick={() => setShowForm(true)} />
        <AdminProductFilters />

        {showForm && <ProductForm onClose={() => setShowForm(false)} />}

        {/* Not: editingProduct desteği ileride düzenleme için entegre edilecek */}

        <AdminProductGrid />

        <hr style={{ margin: "2rem 0" }} />
        <h3>Kategori Yönetimi</h3>
        <CategoryManager />
      </div>
    </>
  );
};

export default AdminPage;

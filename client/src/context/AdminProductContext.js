import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "../services/axiosInstance";

const AdminProductContext = createContext();

export const useAdminProducts = () => useContext(AdminProductContext);

export const AdminProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/products/admin/all");
      setProducts(res.data.data || []);
    } catch (err) {
      console.error("Ürünler alınamadı:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduct = async (data) => {
    try {
      const res = await axios.post("/products", data);
      setProducts((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Ürün eklenemedi:", err);
    }
  };

  const updateProduct = async (id, data) => {
    try {
      const res = await axios.put(`/products/${id}`, data);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? res.data : p))
      );
    } catch (err) {
      console.error("Ürün güncellenemedi:", err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Ürün silinemedi:", err);
    }
  };

  const toggleVisibility = async (id) => {
    try {
      const res = await axios.patch(`/products/${id}/toggle`);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? res.data : p))
      );
    } catch (err) {
      console.error("Görünürlük değiştirilemedi:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <AdminProductContext.Provider
      value={{
        products,
        loading,
        fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleVisibility,
      }}
    >
      {children}
    </AdminProductContext.Provider>
  );
};

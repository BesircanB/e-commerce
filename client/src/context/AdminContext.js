import { createContext, useContext, useState, useEffect } from "react";
import axios from "../services/axiosInstance";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Tüm ürünleri getir
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/products/admin/all");
      setProducts(res.data.data || []);
    } catch (err) {
      console.error("Ürünler alınamadı:", err);
    } finally {
      setLoading(false);
    }
  };

  // Yeni ürün ekle
  const addProduct = async (formData) => {
    try {
      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        image_url: formData.image || null,
        description: formData.description || "",
        stock: formData.stock ?? 10, // default stok
        category_id: formData.category_id ?? null,
        is_visible: formData.visible ?? true,
      };
      await axios.post("/products", payload);
      await fetchProducts();
    } catch (err) {
      console.error("Ürün eklenemedi:", err);
    }
  };

  // Ürün güncelle
  const updateProduct = async (product) => {
    try {
      const payload = {
        name: product.title,
        price: parseFloat(product.price),
        image_url: product.image,
        description: product.description,
        category_id: product.category_id ?? null,
        is_visible: product.visible,
      };
      await axios.put(`/products/${product.id}`, payload);
      await fetchProducts();
    } catch (err) {
      console.error("Ürün güncellenemedi:", err);
    }
  };

  // Ürünü mantıksal olarak sil
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`/products/${id}`);
      await fetchProducts();
    } catch (err) {
      console.error("Ürün silinemedi:", err);
    }
  };

  // Görünürlük değiştir
  const toggleVisibility = async (id, currentVisibility) => {
    try {
      await axios.put(`/products/admin/${id}/visibility`, {
        is_visible: !currentVisibility,
      });
      await fetchProducts();
    } catch (err) {
      console.error("Görünürlük güncellenemedi:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <AdminContext.Provider
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
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);

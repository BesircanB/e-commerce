import { createContext, useContext, useState, useCallback } from "react";
import axios from "../services/axiosInstance";
import { useAuth } from "./AuthContext";

const ProductDetailContext = createContext();

export const ProductDetailProvider = ({ children }) => {
  const { user, token } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);

  const fetchProduct = useCallback(async (productId) => {
    setLoading(true);
    setProduct(null);
    setHasPurchased(false);

    try {
      // Ürün bilgisi
      const endpoint = user?.role === "admin"
        ? `/products/admin/${productId}`
        : `/products/${productId}`;

      const res = await axios.get(endpoint);
      setProduct(res.data);

      // Satın alım kontrolü (optimize edilmiş)
      if (user && token) {
        const purchaseCheck = await axios.get(`/products/${productId}/has-purchased`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHasPurchased(purchaseCheck.data.hasPurchased);
      }

    } catch (err) {
      console.error("Ürün veya satın alma bilgisi alınamadı:", err);
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  return (
    <ProductDetailContext.Provider
      value={{
        product,
        loading,
        isImageModalOpen,
        setImageModalOpen,
        fetchProduct,
        hasPurchased,
      }}
    >
      {children}
    </ProductDetailContext.Provider>
  );
};

export const useProductDetail = () => useContext(ProductDetailContext);

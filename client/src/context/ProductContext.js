// context/ProductContext.js
import { createContext, useContext,useState, useCallback } from "react";
import axios from "../services/axiosInstance";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async (isAdmin = false) => {
    setLoading(true);
    try {
      const endpoint = isAdmin ? "/products/admin/all" : "/products";
      const res = await axios.get(endpoint);
      setProducts(res.data.data || []);
    } catch (err) {
      console.error("Ürünler alınamadı:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ProductContext.Provider value={{ products, loading, fetchProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);

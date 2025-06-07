import { createContext, useContext, useEffect, useState } from "react";
import axios from "../services/axiosInstance";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Sepeti sunucudan getir
  const getCart = async () => {
    if (!token) return;
    try {
      const res = await axios.get("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCartItems(res.data.items || []);
      setTotal(res.data.final_total || 0);
    } catch (err) {
      console.error("Sepet alınamadı:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    if (!token) return;
    try {
      await axios.post(
        "/cart",
        { product_id: productId, quantity: 1 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await getCart();
    } catch (err) {
      console.error("Ürün sepete eklenemedi:", err);
    }
  };

  const increaseQuantity = async (cartItemId) => {
    if (!token) return;
    try {
      const item = cartItems.find((item) => item.id === cartItemId);
      if (!item) return;

      await axios.put(
        `/cart/${cartItemId}`,
        { quantity: item.quantity + 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await getCart();
    } catch (err) {
      console.error("Adet artırılamadı:", err);
    }
  };

  const decreaseQuantity = async (cartItemId) => {
    if (!token) return;
    try {
      const item = cartItems.find((item) => item.id === cartItemId);
      if (!item) return;

      if (item.quantity === 1) {
        await removeFromCart(cartItemId);
      } else {
        await axios.put(
          `/cart/${cartItemId}`,
          { quantity: item.quantity - 1 },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      await getCart();
    } catch (err) {
      console.error("Adet azaltılamadı:", err);
    }
  };

  const removeFromCart = async (productId) => {
    if (!token) return;
    try {
      await axios.delete(`/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await getCart();
    } catch (err) {
      console.error("Ürün sepetten silinemedi:", err);
    }
  };

  const clearCart = async () => {
    if (!token) return;
    try {
      await axios.delete("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      await getCart();
    } catch (err) {
      console.error("Sepet temizlenemedi:", err);
    }
  };

  useEffect(() => {
    getCart();
  }, [token]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        total,
        loading,
        getCart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

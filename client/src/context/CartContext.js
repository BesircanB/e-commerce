import { createContext, useContext, useEffect, useState } from "react";
import { campaigns } from "../models/campaigns"; // 👈 Kampanya verisi

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  const [appliedCampaign, setAppliedCampaign] = useState(null);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const increaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCampaign(null); // Sepet temizlenince kampanya da kalksın
  };

  // 🎯 Kampanya uygulama
  const applyCampaign = (code) => {
    const total = getCartTotal();
    const campaign = campaigns.find(
      (c) => c.code === code.toUpperCase()
    );
    if (!campaign) return { success: false, message: "Kupon kodu geçersiz" };

    if (campaign.minTotal && total < campaign.minTotal) {
      return {
        success: false,
        message: `Bu kampanya için minimum ${campaign.minTotal}₺ harcama gerekir.`,
      };
    }

    setAppliedCampaign(campaign);
    return { success: true };
  };

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getDiscountedTotal = () => {
    let total = getCartTotal();

    if (appliedCampaign) {
      if (appliedCampaign.type === "percentage") {
        total = total * (1 - appliedCampaign.amount / 100);
      } else if (appliedCampaign.type === "fixed") {
        total = total - appliedCampaign.amount;
      }
    }

    return Math.max(total, 0); // eksi olmasın
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
        applyCampaign,
        appliedCampaign,
        getCartTotal,
        getDiscountedTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

// context/CartCampaignContext.js
import { createContext, useContext, useState } from "react";
import axios from "../services/axiosInstance";
import { useAuth } from "./AuthContext";
import { useCart } from "./CartContext";

const CartCampaignContext = createContext();

export const CartCampaignProvider = ({ children }) => {
  const { token } = useAuth();
  const { getCart } = useCart();
  const [campaigns, setCampaigns] = useState(null);

  const applyCampaign = async (code) => {
    if (!token) return { success: false, message: "Giriş yapmalısınız" };

    try {
      const res = await axios.post(
        "/cart/apply-coupon",
        { code },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await getCart(); // Sepeti güncelle
      return { success: true };
    } catch (err) {
      console.error("Kampanya uygulanamadı:", err);
      return {
        success: false,
        message: err.response?.data?.error || "Kampanya kodu geçerli değil",
      };
    }
  };

  return (
    <CartCampaignContext.Provider
      value={{
        campaigns,
        setCampaigns,
        applyCampaign,
      }}
    >
      {children}
    </CartCampaignContext.Provider>
  );
};

export const useCartCampaigns = () => useContext(CartCampaignContext);

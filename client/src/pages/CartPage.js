import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import "../components/cart/CartPage.css";
import Footer from "../components/Footer/Footer";

// Yeni bileşenler
import CartItemList from "../components/cart/CartItemList";
import CouponBox from "../components/cart/CouponBox";
import CampaignSummary from "../components/cart/CampaignSummary";
import CartTotal from "../components/cart/CartTotal";

const CartPage = () => {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    applyCampaign,
    campaigns,
    total,
  } = useCart();

  const { placeOrder } = useOrders();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    setLoading(true);
    const result = await placeOrder();
    setLoading(false);

    if (result.success) {
      navigate("/orders");
    } else {
      alert("Sipariş oluşturulamadı: " + result.message);
    }
  };

  const handleApplyCoupon = async (code) => {
    return await applyCampaign(code);
  };

  return (
    <div>
      <div className="cart-container">
        <div className="cart-columns">
          {/* Sol Sütun: Ürün Listesi */}
          <div className="cart-left">
            <h2 className="cart-title">Sepetim</h2>
            <CartItemList
              items={cartItems}
              onDecrease={decreaseQuantity}
              onIncrease={increaseQuantity}
              onRemove={removeFromCart}
            />
          </div>
          {/* Sağ Sütun: Sipariş Özeti */}
          <div className="cart-right">
            <div className="cart-summary-card">
              <h3 className="summary-title">Sipariş Özeti</h3>
              <CartTotal
                cartItems={cartItems}
                total={total}
                loading={loading}
                onClear={clearCart}
                onPlaceOrder={handlePlaceOrder}
              />
              <CouponBox onApply={handleApplyCoupon} />
              <CampaignSummary campaigns={campaigns} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;

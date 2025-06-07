import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";

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
      <Header />
      <div style={{ padding: "2rem" }}>
        <h2>Sepetim</h2>

        <CartItemList
          items={cartItems}
          onDecrease={decreaseQuantity}
          onIncrease={increaseQuantity}
          onRemove={removeFromCart}
        />

        {cartItems.length > 0 && (
          <>
            <CouponBox onApply={handleApplyCoupon} />
            <CampaignSummary campaigns={campaigns} />
            <CartTotal
              cartItems={cartItems}
              total={total}
              loading={loading}
              onClear={clearCart}
              onPlaceOrder={handlePlaceOrder}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;

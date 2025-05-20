import React from "react";
import { useCart } from "../context/CartContext";
import Header from "../components/Header";

const CartPage = () => {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div>
      <Header />

      <div style={{ padding: "2rem" }}>
        <h2>Sepetim</h2>

        {cartItems.length === 0 ? (
          <p>Sepetiniz boş.</p>
        ) : (
          <>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  style={{
                    borderBottom: "1px solid #ccc",
                    padding: "1rem 0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong>{item.title}</strong>
                    <p>
                      {item.price} ₺ x {item.quantity} ={" "}
                      {(item.price * item.quantity).toFixed(2)} ₺
                    </p>

                    <div>
                      <button onClick={() => decreaseQuantity(item.id)}>➖</button>
                      <button onClick={() => increaseQuantity(item.id)}>➕</button>
                    </div>
                  </div>

                  <button onClick={() => removeFromCart(item.id)}>
                    Kaldır
                  </button>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: "2rem", fontWeight: "bold" }}>
              Toplam: {total.toFixed(2)} ₺
            </div>

            <button onClick={clearCart} style={{ marginTop: "1rem" }}>
              Sepeti Temizle
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;

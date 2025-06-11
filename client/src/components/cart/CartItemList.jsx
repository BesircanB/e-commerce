// src/components/cart/CartItemList.jsx
import React from "react";

const CartItemList = ({ items, onDecrease, onIncrease, onRemove }) => {
  if (!items.length) return <p>Sepetiniz boş.</p>;

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {items.map((item) => (
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
            <strong>{item.crud.name}</strong>
            <p>
              {item.crud.price} ₺ x {item.quantity} ={" "}
              {(item.crud.price * item.quantity).toFixed(2)} ₺
            </p>

            <div>
              <button onClick={() => onDecrease(item.id)}>➖</button>
              <button onClick={() => onIncrease(item.id)}>➕</button>
            </div>
          </div>

          <button onClick={() => onRemove(item.id)}>Kaldır</button>
        </li>
      ))}
    </ul>
  );
};

export default CartItemList;

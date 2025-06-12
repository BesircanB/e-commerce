// src/components/cart/CartItemList.jsx
import React from "react";

const CartItemList = ({ items, onDecrease, onIncrease, onRemove }) => {
  if (!items.length) return <p style={{color:'#888',fontSize:'1.1rem',marginTop:'2rem'}}>Sepetiniz boş.</p>;

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {items.map((item) => (
        <li key={item.id} className="cart-item-card">
          <div className="cart-item-info">
            <span className="cart-item-name">{item.crud.name}</span>
            <span className="cart-item-price">
              {item.crud.price} ₺ x {item.quantity} = {(item.crud.price * item.quantity).toFixed(2)} ₺
            </span>
            <div className="cart-item-qty">
              <button className="qty-btn" onClick={() => onDecrease(item.id)} aria-label="Azalt">–</button>
              <span style={{fontWeight:600}}>{item.quantity}</span>
              <button className="qty-btn" onClick={() => onIncrease(item.id)} aria-label="Arttır">+</button>
            </div>
          </div>
          <button className="cart-item-remove" onClick={() => onRemove(item.id)} aria-label="Kaldır">Kaldır</button>
        </li>
      ))}
    </ul>
  );
};

export default CartItemList;

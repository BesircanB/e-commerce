import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "../services/axiosInstance";
import { FiRepeat, FiArrowLeft } from "react-icons/fi";
import "./OrderDetailPage.css";

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await axios.get(`/orders/${orderId}`);
        setOrder(response.data);
      } catch (error) {
        console.error("Sipariş detayları alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  const handleRepeatOrder = async () => {
    try {
      for (const item of order.order_items || []) {
        await addToCart(item.product_id || item.crud?.id);
      }
      navigate("/cart");
    } catch (error) {
      console.error("Ürünler sepete eklenirken hata oluştu:", error);
    }
  };

  if (loading) {
    return <div className="order-detail-loading">Yükleniyor...</div>;
  }

  if (!order) {
    return <div className="order-detail-error">Sipariş bulunamadı.</div>;
  }

  const formatPrice = (val) => {
    if (typeof val === "number" && !isNaN(val)) return val.toFixed(2);
    if (typeof val === "string" && !isNaN(Number(val))) return Number(val).toFixed(2);
    return "0.00";
  };

  return (
    <div className="order-detail-page">
      <div className="order-detail-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Geri
        </button>
        <h1>Sipariş #{orderId}</h1>
        <button className="repeat-order-button" onClick={handleRepeatOrder}>
          <FiRepeat /> Yeniden Sipariş Ver
        </button>
      </div>

      <div className="order-detail-content">
        <div className="order-info-section">
          <div className="order-status">
            <span className={`status-badge status-${order.status}`}>
              {order.status}
            </span>
          </div>
          <div className="order-meta">
            <p>Sipariş Tarihi: {new Date(order.created_at).toLocaleString()}</p>
            <p>Toplam Tutar: {formatPrice(order.final_total ?? order.total)} ₺</p>
          </div>
        </div>

        <div className="order-items-section">
          <h2>Sipariş Edilen Ürünler</h2>
          <div className="order-items-list">
            {order.order_items?.map((item) => (
              <div key={item.id} className="order-item-card">
                <div className="item-image">
                  <img 
                    src={item.crud?.image_url || "/placeholder.png"} 
                    alt={item.crud?.name} 
                  />
                </div>
                <div className="item-details">
                  <h3 style={{ cursor: 'pointer', color: '#1976d2', textDecoration: 'underline' }}
                    onClick={() => navigate(`/product/${item.crud?.id}`)}
                  >
                    {item.crud?.name}
                  </h3>
                  <p className="item-price">
                    Birim Fiyat: {formatPrice(item.unit_price)} ₺
                  </p>
                  <p className="item-quantity">Adet: {item.quantity}</p>
                  <p className="item-total">
                    Toplam: {formatPrice(item.unit_price * item.quantity)} ₺
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {order.notes && (
          <div className="order-notes-section">
            <h2>Sipariş Notları</h2>
            <p>{order.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPage; 
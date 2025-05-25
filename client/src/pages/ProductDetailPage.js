import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import mockProducts from "../models/mockProducts";
import { useCart } from "../context/CartContext";
import Header from "../components/Header";

const ProductDetailPage = () => {
  const { id } = useParams();
  const product = mockProducts.find((p) => p.id.toString() === id);
  const { addToCart } = useCart();

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5); // ⭐ varsayılan 5 yıldız

  useEffect(() => {
    const stored = localStorage.getItem("comments");
    if (stored) {
      const parsed = JSON.parse(stored);
      setComments(parsed[id] || []);
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newComment.trim() === "") return;

    const newEntry = {
      user: "Anonim",
      text: newComment,
      rating: newRating,
      date: new Date().toISOString(),
    };

    const updatedComments = [...comments, newEntry];
    setComments(updatedComments);

    const allComments = JSON.parse(localStorage.getItem("comments")) || {};
    allComments[id] = updatedComments;
    localStorage.setItem("comments", JSON.stringify(allComments));

    setNewComment("");
    setNewRating(5);
  };

  const calculateAverageRating = () => {
    if (comments.length === 0) return 0;
    const total = comments.reduce((sum, c) => sum + (c.rating || 0), 0);
    return (total / comments.length).toFixed(1);
  };

  if (!product) {
    return (
      <div>
        <Header />
        <p style={{ padding: "2rem" }}>Ürün bulunamadı.</p>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div style={{ padding: "2rem", display: "flex", gap: "2rem" }}>
        <img
          src={product.image}
          alt={product.title}
          style={{ width: "300px", borderRadius: "8px" }}
        />
        <div>
          <h2>{product.title}</h2>
          <p>{product.description || "Ürün açıklaması mevcut değil."}</p>
          <h3>{product.price.toFixed(2)} ₺</h3>
          <p>
            ⭐ Ortalama Puan:{" "}
            {calculateAverageRating() > 0
              ? `${calculateAverageRating()} / 5`
              : "Henüz puan yok"}
          </p>
          <button onClick={() => addToCart(product)}>Sepete Ekle</button>
        </div>
      </div>

      <div style={{ padding: "2rem" }}>
        <h3>Yorumlar</h3>

        {comments.length === 0 ? (
          <p>Henüz yorum yapılmamış.</p>
        ) : (
          <ul style={{ paddingLeft: "1rem" }}>
            {comments.map((c, i) => (
              <li key={i} style={{ marginBottom: "1rem" }}>
                <strong>{c.user}</strong> ({new Date(c.date).toLocaleString()})<br />
                ⭐ {c.rating} / 5<br />
                {c.text}
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Yorumunuzu yazın..."
            rows="4"
            style={{ width: "100%", padding: "0.5rem" }}
          />

          <div style={{ marginTop: "1rem" }}>
            <label>⭐ Puan: </label>
            <select
              value={newRating}
              onChange={(e) => setNewRating(parseInt(e.target.value))}
            >
              <option value={5}>5 - Mükemmel</option>
              <option value={4}>4 - İyi</option>
              <option value={3}>3 - Orta</option>
              <option value={2}>2 - Kötü</option>
              <option value={1}>1 - Berbat</option>
            </select>
          </div>

          <button
            type="submit"
            style={{
              marginTop: "0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Yorum Ekle
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductDetailPage;

import React, { useEffect, useState } from "react";
import axios from "../services/axiosInstance";
import { useAuth } from "../context/AuthContext";

const ProductReviews = ({ productId, averageRating }) => {
  const { user, token } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [photoUrl, setPhotoUrl] = useState("");
  const [userReview, setUserReview] = useState(null);
  const [error, setError] = useState("");

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`/products/${productId}/reviews`);
      setReviews(res.data || []);
      if (user) {
        const existing = res.data.find((r) => r.user_id === user.id);
        if (existing) {
          setUserReview(existing);
          setComment(existing.comment || "");
          setRating(existing.rating);
          setPhotoUrl(existing.photo_url || "");
        }
      }
    } catch (err) {
      console.error("Yorumlar alınamadı:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!token) {
      setError("Yorum yapmak için giriş yapmalısınız.");
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (userReview) {
        await axios.put(
          `/products/${productId}/reviews/${userReview.id}`,
          { rating, comment, photo_url: photoUrl },
          config
        );
      } else {
        await axios.post(
          `/products/${productId}/reviews`,
          { rating, comment, photo_url: photoUrl },
          config
        );
      }

      setComment("");
      setPhotoUrl("");
      setRating(5);
      setUserReview(null);
      await fetchReviews();
    } catch (err) {
      console.error("Yorum gönderilemedi:", err);
      setError(err.response?.data?.error || "Hata oluştu");
    }
  };

  const handleDelete = async () => {
    if (!userReview || !token) return;
    try {
      await axios.delete(
        `/products/${productId}/reviews/${userReview.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserReview(null);
      setComment("");
      setPhotoUrl("");
      setRating(5);
      await fetchReviews();
    } catch (err) {
      console.error("Yorum silinemedi:", err);
    }
  };

  const renderStars = (value) => {
    const full = Math.floor(value);
    const half = value % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
  };

  if (loading) return <p>Yorumlar yükleniyor...</p>;

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>
        Yorumlar ({reviews.length}){" "}
        {reviews.length > 0 && (
          <span style={{ fontWeight: "normal", fontSize: "0.95rem", color: "#666" }}>
            – {renderStars(averageRating)} ({averageRating.toFixed(1)} / 5)
          </span>
        )}
      </h3>

      {reviews.length === 0 && <p>Henüz yorum yapılmamış.</p>}

      {reviews.map((rev) => (
        <div
          key={rev.id}
          style={{
            border: "1px solid #ddd",
            padding: "1rem",
            marginBottom: "1rem",
            borderRadius: "6px",
            backgroundColor: user && user.id === rev.user_id ? "#f0f8ff" : "#fff",
          }}
        >
          <p><strong>Puan:</strong> {"⭐".repeat(rev.rating)}</p>
          {rev.comment && <p><strong>Yorum:</strong> {rev.comment}</p>}
          {rev.photo_url && (
            <img
              src={rev.photo_url}
              alt="yorum görseli"
              style={{ maxWidth: "150px", borderRadius: "4px", marginTop: "0.5rem" }}
            />
          )}
          <p style={{ fontSize: "0.85rem", color: "#666" }}>
            {rev.users?.name && <span>{rev.users.name} | </span>}
            {new Date(rev.created_at).toLocaleString()}
          </p>
        </div>
      ))}

      {user && (
        <div style={{ marginTop: "2rem" }}>
          <h4>{userReview ? "Yorumunuzu Güncelleyin" : "Yorum Yapın"}</h4>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <label>
              Puan:
              <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>{r} ⭐</option>
                ))}
              </select>
            </label>
            <textarea
              rows="3"
              placeholder="Yorumunuz (isteğe bağlı)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <input
              type="text"
              placeholder="Fotoğraf URL'si (isteğe bağlı)"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div style={{ display: "flex", gap: "1rem" }}>
              <button type="submit" style={{ backgroundColor: "#28a745", color: "white", padding: "0.5rem" }}>
                {userReview ? "Güncelle" : "Gönder"}
              </button>
              {userReview && (
                <button
                  type="button"
                  onClick={handleDelete}
                  style={{ backgroundColor: "#dc3545", color: "white", padding: "0.5rem" }}
                >
                  Sil
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;

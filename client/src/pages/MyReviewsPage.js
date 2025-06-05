import React, { useEffect, useState } from "react";
import axios from "../services/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Header from "../components/Header";

const MyReviewsPage = () => {
  const { user, token } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingReview, setEditingReview] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(5);
  const [editPhotoUrl, setEditPhotoUrl] = useState("");

  const fetchUserReviews = async () => {
    try {
      const res = await axios.get("/users/me/reviews", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(res.data || []);
    } catch (err) {
      console.error("Yorumlar alınamadı:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUserReviews();
  }, [token]);

  const handleDelete = async (reviewId, productId) => {
    const confirm = window.confirm("Bu yorumu silmek istediğinize emin misiniz?");
    if (!confirm) return;

    try {
      await axios.delete(`/products/${productId}/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchUserReviews();
    } catch (err) {
      console.error("Yorum silinemedi:", err);
      alert("Yorum silinirken bir hata oluştu.");
    }
  };

  const openEditModal = (review) => {
    setEditingReview(review);
    setEditComment(review.comment || "");
    setEditRating(review.rating);
    setEditPhotoUrl(review.photo_url || "");
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `/products/${editingReview.product_id}/reviews/${editingReview.id}`,
        {
          rating: editRating,
          comment: editComment,
          photo_url: editPhotoUrl,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditingReview(null);
      await fetchUserReviews();
    } catch (err) {
      console.error("Yorum güncellenemedi:", err);
      alert("Yorum güncellenirken bir hata oluştu.");
    }
  };

  const renderStars = (rating) => "⭐".repeat(rating) + "☆".repeat(5 - rating);

  if (loading) {
    return (
      <div>
        <Header />
        <p style={{ padding: "2rem" }}>Yorumlar yükleniyor...</p>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div style={{ padding: "2rem" }}>
        <h2>Yorumlarım</h2>
        {reviews.length === 0 ? (
          <p>Henüz hiç yorum yapmadınız.</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                marginBottom: "1rem",
                borderRadius: "8px",
                display: "flex",
                gap: "1rem",
              }}
            >
              <img
                src={review.crud?.image_url || "https://via.placeholder.com/100"}
                alt={review.crud?.name || "Ürün"}
                style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "6px" }}
              />
              <div style={{ flexGrow: 1 }}>
                <Link to={`/product/${review.product_id}`}>
                  <h3 style={{ marginBottom: "0.3rem" }}>{review.crud?.name || "Ürün"}</h3>
                </Link>
                <p><strong>Puan:</strong> {renderStars(review.rating)}</p>
                {review.comment && <p><strong>Yorum:</strong> {review.comment}</p>}
                {review.photo_url && review.photo_url.trim() !== "" && (
                  <img
                    src={review.photo_url}
                    alt="yorum görseli"
                    style={{ maxWidth: "150px", marginTop: "0.5rem", borderRadius: "4px" }}
                  />
                )}
                <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.5rem" }}>
                  {new Date(review.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <button
                  onClick={() => openEditModal(review)}
                  style={{
                    backgroundColor: "#ffc107",
                    color: "black",
                    padding: "0.4rem 0.8rem",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginBottom: "0.5rem",
                  }}
                >
                  Güncelle
                </button>
                <button
                  onClick={() => handleDelete(review.id, review.product_id)}
                  style={{
                    backgroundColor: "#dc3545",
                    color: "white",
                    padding: "0.4rem 0.8rem",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Sil
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {editingReview && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex", justifyContent: "center", alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div style={{
            background: "#fff",
            padding: "2rem",
            borderRadius: "8px",
            width: "100%",
            maxWidth: "500px",
            boxShadow: "0 0 10px rgba(0,0,0,0.3)"
          }}>
            <h3>Yorumu Güncelle</h3>
            <label>
              Puan:
              <select value={editRating} onChange={(e) => setEditRating(Number(e.target.value))}>
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>{r} ⭐</option>
                ))}
              </select>
            </label>
            <br />
            <label>
              Yorum:
              <textarea
                rows="3"
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                style={{ width: "100%" }}
              />
            </label>
            <br />
            <label>
              Fotoğraf URL:
              <input
                type="text"
                value={editPhotoUrl}
                onChange={(e) => setEditPhotoUrl(e.target.value)}
                style={{ width: "100%" }}
              />
            </label>
            <br />
            <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
              <button onClick={() => setEditingReview(null)}>İptal</button>
              <button
                onClick={handleUpdate}
                style={{ backgroundColor: "#28a745", color: "white", padding: "0.5rem 1rem", border: "none", borderRadius: "4px" }}
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReviewsPage;

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useReviews } from "../../context/ReviewContext";
import { useNavigate } from "react-router-dom";

const ReviewForm = ({ productId }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    userReview,
    submitReview,
    deleteReview,
    loading,
    error,
  } = useReviews();

  const [rating, setRating] = useState(userReview?.rating || 5);
  const [comment, setComment] = useState(userReview?.comment || "");
  const [photoUrl, setPhotoUrl] = useState(userReview?.photo_url || "");

  if (!user) {
    return (
      <div style={{ marginTop: "2rem" }}>
        <p>Yorum yapmak için giriş yapmalısınız.</p>
        <button onClick={() => navigate("/login")}>Giriş Yap</button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitReview({ productId, rating, comment, photo_url: photoUrl });
  };

  const handleDelete = async () => {
    await deleteReview(productId);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>
      <h4>{userReview ? "Yorumunu Güncelle" : "Yorum Yap"}</h4>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onClick={() => setRating(star)}
            style={{
              fontSize: "1.5rem",
              color: star <= rating ? "orange" : "lightgray",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        rows={3}
        placeholder="Yorumunuzu yazın..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        style={{ width: "100%", marginBottom: "1rem" }}
      />

      <input
        type="text"
        placeholder="Fotoğraf URL (isteğe bağlı)"
        value={photoUrl}
        onChange={(e) => setPhotoUrl(e.target.value)}
        style={{ width: "100%", marginBottom: "1rem" }}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "flex", gap: "1rem" }}>
        <button type="submit" disabled={loading}>
          {userReview ? "Güncelle" : "Gönder"}
        </button>
        {userReview && (
          <button type="button" onClick={handleDelete} disabled={loading} style={{ color: "red" }}>
            Sil
          </button>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;

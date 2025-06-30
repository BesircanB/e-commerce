import React, { useEffect } from "react";
import { useUserReviews } from "../context/UserReviewContext";
import { Link } from "react-router-dom";
import "./ReviewsPage.css";
import { FiStar, FiExternalLink } from "react-icons/fi";

const ReviewsPage = () => {
  const { userReviews, loading, error, fetchUserReviews } = useUserReviews();

  useEffect(() => {
    fetchUserReviews();
  }, [fetchUserReviews]);

  if (loading) {
    return <div className="reviews-loading">Yorumlarınız yükleniyor...</div>;
  }

  if (error) {
    return <div className="reviews-error">{error}</div>;
  }

  if (!userReviews?.length) {
    return <div className="reviews-empty">Henüz bir yorum yapmamışsınız.</div>;
  }

  return (
    <div className="reviews-content">
      <h2 className="reviews-title">Yorumlarım</h2>
      <div className="reviews-grid">
        {userReviews.map((review) => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <Link to={`/product/${review.product.id}`} className="review-product-name">
                {review.product.name}
                <FiExternalLink style={{ marginLeft: 6, fontSize: 14 }} />
              </Link>
              <div className="review-rating">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={i < review.rating ? "star filled" : "star"}
                  />
                ))}
              </div>
            </div>
            <p className="review-text">{review.comment}</p>
            {review.photo_url && (
              <img 
                src={review.photo_url} 
                alt="Yorum fotoğrafı" 
                className="review-photo"
              />
            )}
            <div className="review-date">
              {new Date(review.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsPage; 
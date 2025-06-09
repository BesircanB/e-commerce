// Yıldız puanı 1 ile 5 arasında olmalı
function validateRating(rating) {
  if (rating == null) return false;
  const num = Number(rating);
  return num >= 1 && num <= 5;
}

// Yorum metnini temizle
function cleanComment(comment) {
  if (!comment || typeof comment !== "string") return "";
  return comment.trim();
}

// Kullanıcı adı boşsa "Kullanıcı" olarak döndür
function formatReviewUserName(name) {
  return name?.trim() || "Kullanıcı";
}

module.exports = {
  validateRating,
  cleanComment,
  formatReviewUserName,
};

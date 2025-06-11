// server/middlewares/errorHandler.js
function errorHandler(err, req, res, next) {
  console.error("💥 HATA:", err.stack || err.message);
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    error: err.message || "Bilinmeyen bir hata oluştu",
  });
}

module.exports = errorHandler;

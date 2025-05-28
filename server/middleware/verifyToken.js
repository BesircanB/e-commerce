// server/middleware/verifyToken.js

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  // “Bearer xxx” veya direkt “xxx” ikisini de kabul edelim
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : authHeader.trim();

  if (!token) {
    return res.status(401).json({ error: "Token eksik veya hatalı" });
  }

  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded içinde userId veya id hangisi varsa o değeri number olarak al
    const rawId = decoded.userId || decoded.id;
    const id = Number(rawId);
    if (isNaN(id)) {
      return res.status(401).json({ error: "Token içeriği geçersiz" });
    }
    req.user = {
      id,                     // artık kesin number
      email: decoded.email,
      role:  decoded.role
    };
    next();
  } catch (err) {
    console.error("verifyToken hata:", err);
    return res.status(401).json({ error: "Token doğrulanamadı veya süresi dolmuş" });
  }
};

module.exports = verifyToken;

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || "";

  // “Bearer xxx” veya direkt “xxx” ikisini de kabul eder
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : authHeader.trim();

  if (!token) {
    return res.status(401).json({ error: "Token eksik veya hatalı" });
  }
//

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // UUID olabilir, Number() kullanma!
    if (!decoded.userId || typeof decoded.userId !== "string") {
      return res.status(401).json({ error: "Token içeriği geçersiz" });
    }

    req.user = {
      id: decoded.userId,           // UUID string olarak bırakıldı
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (err) {
    console.error("verifyToken hata:", err);
    return res.status(401).json({ error: "Token doğrulanamadı veya süresi dolmuş" });
  }
};

module.exports = verifyToken;

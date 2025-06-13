const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const verifyTokenOrSession = (req, res, next) => {
  const authHeader = req.headers.authorization || "";

  // "Bearer xxx" veya direkt "xxx" ikisini de kabul eder
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : authHeader.trim();

  if (token) {
    // Token varsa normal doğrulama yap
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded.userId || typeof decoded.userId !== "string") {
        return res.status(401).json({ error: "Token içeriği geçersiz" });
      }

      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        isAuthenticated: true
      };

      return next();
    } catch (err) {
      console.error("Token doğrulama hatası:", err);
      return res.status(401).json({ error: "Token doğrulanamadı veya süresi dolmuş" });
    }
  }

  // Token yoksa session ID kontrol et veya oluştur
  const sessionId = req.headers['x-session-id'] || req.query.sessionId;
  
  if (sessionId) {
    // Mevcut session ID'yi kullan
    req.user = {
      userId: `guest_${sessionId}`,
      sessionId: sessionId,
      isAuthenticated: false,
      role: 'guest'
    };
  } else {
    // Yeni session ID oluştur
    const newSessionId = uuidv4();
    req.user = {
      userId: `guest_${newSessionId}`,
      sessionId: newSessionId,
      isAuthenticated: false,
      role: 'guest'
    };
    
    // Response header'ında session ID'yi döndür
    res.setHeader('X-Session-ID', newSessionId);
  }

  next();
};

module.exports = verifyTokenOrSession; 
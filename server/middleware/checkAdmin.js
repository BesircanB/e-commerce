const checkAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Yetkisiz: Bu işlem yalnızca admin kullanıcılar içindir." });
  }
};

module.exports = checkAdmin;

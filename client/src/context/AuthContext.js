import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState(() => {
    return localStorage.getItem("password") || "123456"; // varsayılan mock şifre
  });

  // Kullanıcıyı localStorage'dan al
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Kullanıcı giriş yapınca
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const changePassword = (oldPass, newPass) => {
    if (oldPass === password) {
      setPassword(newPass);
      localStorage.setItem("password", newPass);
      return { success: true };
    } else {
      return { success: false, message: "Eski şifre yanlış" };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState(() => {
    return localStorage.getItem("password") || "123456";
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); // ❗️Sadece user bilgisini temizle
    // ❌ localStorage.clear() kesinlikle kullanılmamalı!
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


export const useAuth = () => useContext(AuthContext);

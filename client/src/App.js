import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Sayfalar
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import CartPage from "./pages/CartPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProfilePage from "./pages/ProfilePage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import WishlistPage from "./pages/WishlistPage";
import AdminPage from "./pages/AdminPage"; // ✅ Admin sayfası eklendi

// Modal
import ChangePasswordModal from "./components/ChangePasswordModal";

// Context Provider'lar
import { AuthProvider } from "./context/AuthContext";
import { SearchProvider } from "./context/SearchContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { AddressProvider } from "./context/AddressContext";
import { OrderProvider } from "./context/OrderContext";

// Route kontrolleri
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute"; // ✅ Admin route eklendi

// Stil
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <CartProvider>
          <WishlistProvider>
            <AddressProvider>
              <OrderProvider>
                <Router>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />

                    {/* Giriş gerektiren sayfalar */}
                    <Route
                      path="/profile"
                      element={
                        <PrivateRoute>
                          <ProfilePage />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/checkout"
                      element={
                        <PrivateRoute>
                          <CheckoutPage />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/orders"
                      element={
                        <PrivateRoute>
                          <OrdersPage />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/wishlist"
                      element={
                        <PrivateRoute>
                          <WishlistPage />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/change-password"
                      element={
                        <PrivateRoute>
                          <ChangePasswordModal />
                        </PrivateRoute>
                      }
                    />

                    {/* ✅ Admin panel route'u */}
                    <Route
                      path="/admin"
                      element={
                        <AdminRoute>
                          <AdminPage />
                        </AdminRoute>
                      }
                    />
                  </Routes>
                </Router>
              </OrderProvider>
            </AddressProvider>
          </WishlistProvider>
        </CartProvider>
      </SearchProvider>
    </AuthProvider>
  );
}

export default App;

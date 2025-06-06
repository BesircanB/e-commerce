import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Sayfalar
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import CartPage from "./pages/CartPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProfilePage from "./pages/ProfilePage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import WishlistPage from "./pages/WishlistPage";
import AdminPage from "./pages/AdminPage";
import MyReviewsPage from "./pages/MyReviewsPage";
import AdminCampaigns from "./pages/AdminCampaigns";
import CategoryPage from "./pages/CategoryPage";
import AdminOrders from "./pages/AdminOrders"; // ✅ Admin Sipariş Sayfası

// Modal
import ChangePasswordModal from "./components/ChangePasswordModal";

// Context Provider'lar
import { AuthProvider } from "./context/AuthContext";
import { SearchProvider } from "./context/SearchContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { AddressProvider } from "./context/AddressContext";
import { OrderProvider } from "./context/OrderContext";
import { AdminProvider } from "./context/AdminContext";
import { CampaignProvider } from "./context/CampaignContext";
import { CategoryProvider } from "./context/CategoryContext";
import { AdminOrdersProvider } from "./context/AdminOrdersContext"; // ✅ yeni context

// Route korumaları
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";

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
                <CategoryProvider>
                  <Router>
                    <Routes>
                      {/* Genel Sayfalar */}
                      <Route path="/" element={<HomePage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                      <Route path="/reset-password" element={<ResetPasswordPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/product/:id" element={<ProductDetailPage />} />
                      <Route path="/category/:id" element={<CategoryPage />} />

                      {/* Giriş Gerektiren Sayfalar */}
                      <Route path="/profile" element={
                        <PrivateRoute>
                          <ProfilePage />
                        </PrivateRoute>
                      } />
                      <Route path="/profile/my-reviews" element={
                        <PrivateRoute>
                          <MyReviewsPage />
                        </PrivateRoute>
                      } />
                      <Route path="/checkout" element={
                        <PrivateRoute>
                          <CheckoutPage />
                        </PrivateRoute>
                      } />
                      <Route path="/orders" element={
                        <PrivateRoute>
                          <OrdersPage />
                        </PrivateRoute>
                      } />
                      <Route path="/wishlist" element={
                        <PrivateRoute>
                          <WishlistPage />
                        </PrivateRoute>
                      } />
                      <Route path="/change-password" element={
                        <PrivateRoute>
                          <ChangePasswordModal />
                        </PrivateRoute>
                      } />

                      {/* Admin Sayfaları */}
                      <Route path="/admin" element={
                        <AdminRoute>
                          <AdminProvider>
                            <AdminPage />
                          </AdminProvider>
                        </AdminRoute>
                      } />
                      <Route path="/admin/campaigns" element={
                        <AdminRoute>
                          <CampaignProvider>
                            <AdminCampaigns />
                          </CampaignProvider>
                        </AdminRoute>
                      } />
                      <Route path="/admin/orders" element={
                        <AdminRoute>
                          <AdminOrdersProvider>
                            <AdminOrders />
                          </AdminOrdersProvider>
                        </AdminRoute>
                      } />
                    </Routes>
                  </Router>
                </CategoryProvider>
              </OrderProvider>
            </AddressProvider>
          </WishlistProvider>
        </CartProvider>
      </SearchProvider>
    </AuthProvider>
  );
}

export default App;

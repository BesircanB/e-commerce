import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { Outlet, useLocation } from "react-router-dom";
import "./AdminDashboard.css";
import { AdminProductProvider } from "../../context/AdminProductContext";

const AdminLayout = ({ children }) => {
  const location = useLocation();
  // Profil sayfasında sidebar gösterme
  const isProfilePage = location.pathname === "/admin/profile";
  return (
    <AdminProductProvider>
      <AdminHeader />
      <div className="admin-dashboard-container">
        {!isProfilePage && <AdminSidebar />}
        <main className="admin-dashboard-main">
          {children ? children : <Outlet />}
        </main>
      </div>
    </AdminProductProvider>
  );
};

export default AdminLayout; 
import React from 'react';
import ReactDOM from 'react-dom/client';
import { SearchProvider } from './context/SearchContext';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CartProvider } from "./context/CartContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SearchProvider>
      <AuthProvider>
        <CartProvider> {/* ✅ yeni */}
          <App />
        </CartProvider>
      </AuthProvider>
    </SearchProvider>
  </React.StrictMode>
);



reportWebVitals();

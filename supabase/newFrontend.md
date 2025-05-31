# 🛒 Ecommerce React App (Frontend Only)

A simple and modular e-commerce frontend built with **React**.  
Includes user authentication, product listing, cart management, and search functionality.  
Backend integration is planned (currently mocked).

---

## ✅ Features Implemented

### 🔐 Authentication
- Email/password login, register, forgot password pages
- AuthContext used to manage login state
- Login state persists using `localStorage`
- Conditional rendering in header based on auth

### 🛍️ Product Listing
- Product cards shown on homepage using mock data
- ProductList component filters products by search keyword
- Reusable ProductCard component

### 🔎 Search System
- SearchContext used to control search input globally
- Header search input filters visible product cards instantly

### 🛒 Cart System
- `CartContext` manages all cart logic
- "Add to Cart" button on each product
- Cart page: list of items, quantity controls (+ / -), remove item
- Total cost calculated dynamically
- Cart stored in `localStorage` so it survives refresh
- Header shows cart item count in top-right

### 🧱 UI Structure
- Pages: `HomePage`, `LoginPage`, `RegisterPage`, `ForgotPasswordPage`, `CartPage`
- Components: `Header`, `ProductCard`, `ProductList`
- Modular CSS structure (`App.css`, `ProductCard.css`, `Header.css`)

---

## 🛠 Technologies Used

- React (functional components + hooks)
- React Router DOM (v6+)
- Context API
- LocalStorage
- CSS (custom styles, no framework yet)

---

## 🚧 Coming Next (Planned)

- Product Detail Page (`/product/:id`)
- Backend integration (auth, cart, products) via Supabase or Node.js
- Admin panel (add/edit/delete products)
- Order system + checkout flow
- Protected routes (`/profile`, `/orders`, etc.)

---

## 📂 Folder Structure (simplified)

src/
├── components/
│ ├── Header.js
│ ├── ProductCard.js
│ └── ProductList.js
├── context/
│ ├── AuthContext.js
│ ├── CartContext.js
│ └── SearchContext.js
├── pages/
│ ├── HomePage.js
│ ├── LoginPage.js
│ ├── RegisterPage.js
│ ├── ForgotPasswordPage.js
│ └── CartPage.js
├── App.js
└── index.js

This is frontend-only for now.

Backend folder is being developed separately by teammate.

Current logic assumes a public product list (mocked).

Easy to plug into backend when ready.


# E-Ticaret Projesi - Tam Doküman

## 🌐 Genel Bilgiler

Bu proje, React tabanlı bir frontend ve Node.js (Express) ile geliştirilmiş bir backend sistemine sahip tam fonksiyonel bir e-ticaret uygulamasıdır. Supabase veritabanı altyapısı kullanılmakta olup, JWT ile kimlik doğrulama, Google ile giriş, kampanya sistemi, şifre sıfırlama gibi birçok özelliği destekler.

## 🤖 Kullanılan Teknolojiler

### Frontend

* React
* React Router
* Context API (Auth, Cart, Wishlist, Order, Search)
* Axios

### Backend

* Node.js
* Express.js
* Supabase (veritabanı olarak)
* JSON Web Token (JWT)
* Bcrypt (parola şifreleme)
* Nodemailer (e-posta gönderimi)

### Diğer

* Supabase Google OAuth
* Supabase Edge Function (bazı operasyonlar)
* Thunder Client / Postman (manuel test)

---

## 🔧 Proje Yapısı

### Frontend (client)

```
ecommerce-project/client/
├── pages/
│   ├── HomePage.js
│   ├── LoginPage.js
│   ├── RegisterPage.js
│   ├── ForgotPasswordPage.js
│   ├── ResetPasswordPage.js
│   ├── CartPage.js
│   ├── ProfilePage.js
│   ├── OrdersPage.js
│   ├── ProductDetailPage.js
├── components/
│   ├── Header.js
│   ├── Modal.js
│   ├── ProductCard.js
│   ├── ProductList.js
├── context/
│   ├── AuthContext.js
│   ├── CartContext.js
│   ├── SearchContext.js
│   ├── WishlistContext.js
│   ├── OrderContext.js
├── routes/
│   ├── PrivateRoute.js
│   ├── AdminRoute.js
├── models/
│   ├── mockProducts.js
│   ├── campaigns.js
├── services/
│   ├── axiosInstance.js
├── App.js
```

### Backend (server)

```
ecommerce-project/server/
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── productController.js
│   ├── cartController.js
│   ├── campaignController.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── products.js
│   ├── cart.js
│   ├── campaigns.js
├── middleware/
│   ├── verifyToken.js
│   ├── checkAdmin.js
├── services/
│   ├── supabase.js
│   ├── emailService.js
├── .env
├── index.js
```

---

## 🔎 API Endpointleri

### Auth

```
POST   /api/register
POST   /api/login
POST   /api/google-login
POST   /api/forgot-password
POST   /api/reset-password
```

### Kullanıcılar

```
GET    /api/users/me          (token zorunlu)
```

### Ürünler

```
GET    /api/products
GET    /api/products/:id
POST   /api/products          (admin, token zorunlu)
PUT    /api/products/:id      (admin)
DELETE /api/products/:id      (admin)
```

### Sepet

```
POST   /api/cart              (token zorunlu)   -> sepete ürün ekle
GET    /api/cart              (token zorunlu)   -> sepeti getir
PUT    /api/cart/:id          (token zorunlu)   -> adet güncelle
DELETE /api/cart/:id          (token zorunlu)   -> sepetten ürün sil
POST   /api/cart/apply-coupon (token zorunlu)   -> kampanya uygula
```

### Kampanyalar

```
GET    /api/campaigns         (aktif kampanyalar)
POST   /api/campaigns         (admin)
```

---

## 🌟 Uygulanan Özellikler

*

---

## 📌 Devam Eden / Planlanan Özellikler

*

---

## 🔑 Ortam Değişkenleri (.env)

```
PORT=5000
SUPABASE_PROJECT_ID=...
SUPABASE_URL=https://....supabase.co
SUPABASE_KEY=anon-key
SUPABASE_SERVICE_ROLE_KEY=service-role-key
JWT_SECRET=supersecret

GOOGLE_CLIENT_ID=....apps.googleusercontent.com
MAIL_HOST=...
MAIL_PORT=587
MAIL_USER=...
MAIL_PASS=...
```

---

## 🔄 Kurulum Talimatları

### 1. Backend

```bash
cd server
npm install
node index.js
```

### 2. Frontend

```bash
cd client
npm install
npm start
```

---

## ✅ Önemli Notlar

* Kampanya kodları, Supabase `campaigns` tablosundan tanımlanır.
* Sepete ekleme yapılırken stok kontrolü yapılır.
* JWT token süresi dolarsa kullanıcı yeniden giriş yapmalıdır.
* Uygulama clean code prensiplerine uygun olarak geliştirilmektedir. (DRY, SRP)

---

## 🎉 Katkı

Proje geliştirilmeye devam etmektedir. Yeni özellikler ve modüller eklendikçe bu README güncellenecektir.


# 📦 E-Commerce Backend API

Bu proje, Node.js ve Express ile yazılmış modern bir e-ticaret backend servisidir. Veriler Supabase kullanılarak saklanır. Geliştirme sürecinde clean code prensipleri ve adım adım test odaklı ilerleme benimsenmiştir.

---

## 🧱 Genel Bilgiler

- **Backend Framework**: Express.js
- **Veritabanı**: Supabase (PostgreSQL tabanlı)
- **Kimlik Doğrulama**: JWT
- **Test Ortamı**: Jest (manuel + otomatik testler)
- **API Formatı**: RESTful
- **Email Servisi**: Nodemailer (SMTP)

---

## ✅ Tamamlanan Özellikler

### 🔐 Kimlik Doğrulama & Kullanıcı Yönetimi
- Kullanıcı kayıt & giriş
- JWT ile kullanıcı kimliği doğrulama
- Admin / User rolleri

### 🛒 Ürün Yönetimi
- Kullanıcılara görünür ürün listesi (`is_visible`)
- Ürün detayları görüntüleme
- Admin: Ürün ekleme, güncelleme, silme (mantıksal silme)
- Stok yönetimi & fiyat kontrolü
- Ürünlerin kategoriye göre filtrelenmesi

### 📂 Kategori Yönetimi
- Admin: Kategori oluşturma, düzenleme, silme
- Silme sırasında bağlı ürün kontrolü

### 🛍️ Sepet (Cart) İşlemleri
- Ürün sepete ekleme / çıkarma / güncelleme
- Sepet görüntüleme
- Aynı ürün tekrar eklendiğinde adet güncellenir
- Kampanya kodu tanımlama ve uygulama

### 🎫 Kampanya Sistemi
- Admin: Kod, indirim oranı ve tarih aralığı ile kampanya oluşturma
- Kullanıcı: Kupon kodunu sepete uygulayarak indirim alma

### 🧾 Sipariş Yönetimi
- Kullanıcı sepetinden sipariş oluşturabilir
- Sipariş oluşturulurken stok kontrolü yapılır
- Sipariş detayları, geçmiş siparişler görüntülenebilir
- Admin: Tüm siparişleri listeleme & sipariş durumunu güncelleme
- Sipariş iptali (pending ve paid durumları için)

### ✨ Wishlist Sistemi
- Kullanıcı: Favori ürünlerini wishlist'e ekleyebilir
- Listeleme & silme işlemleri yapılabilir
- Aynı ürün birden fazla kez eklenemez

### 💬 Yorum ve Puanlama Sistemi
- Sadece ürünü satın alan kullanıcı yorum yapabilir
- Kullanıcı isterse sadece yıldız, isterse yıldız + yorum ekleyebilir
- Kullanıcı yorumunu güncelleyebilir / silebilir
- Admin: Ürünlere gelen tüm yorumları görebilir
- Ürün detayında ortalama puan hesaplanır

---

## 🔗 API Endpointleri (Seçili)

### AUTH
- `POST /api/auth/register`
- `POST /api/auth/login`

### USERS
- `GET /api/users/me`

### PRODUCTS
- `GET /api/products` → kullanıcıya görünür ürünler
- `GET /api/products/all` → admin için tüm ürünler
- `GET /api/products/:id`
- `GET /api/products/:id/admin`
- `POST /api/products` → admin
- `PUT /api/products/:id` → admin
- `PUT /api/products/:id/visibility` → admin
- `PUT /api/products/:id/stock` → admin
- `DELETE /api/products/:id` → mantıksal silme

### CATEGORIES
- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`

### CART
- `GET /api/cart`
- `POST /api/cart`
- `PUT /api/cart/:id`
- `DELETE /api/cart/:id`
- `POST /api/cart/apply-coupon`

### WISHLIST
- `GET /api/wishlist`
- `POST /api/wishlist`
- `DELETE /api/wishlist/:product_id`

### CAMPAIGNS
- `GET /api/campaigns` → aktif kampanyaları getir (public)

### ORDERS
- `POST /api/orders`
- `GET /api/orders/my`
- `GET /api/orders/:id`
- `PATCH /api/orders/:id/cancel`
- `GET /api/orders/all` → admin
- `PUT /api/orders/:id/status` → admin

### REVIEWS
- `GET /api/products/:id/reviews`
- `POST /api/reviews`
- `PUT /api/reviews/:id`
- `DELETE /api/reviews/:id`

---

## 📅 Son Güncelleme

2025-06-01 17:49:38

---

## 📌 Notlar
- Proje geliştirmesi sırasında her adım manuel test edilmiştir.
- Clean code ve modüler yapı prensiplerine uygunluk gözetilmiştir.
- Geliştirme sırasında kullanıcı doğrulaması ve admin kontrollerine dikkat edilmiştir.

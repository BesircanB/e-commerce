
# E-Ticaret Sitesi Backend

Bu proje, kullanıcıların ürünleri görüntüleyip sipariş verebildiği, adminlerin ise ürünleri ve siparişleri yönetebildiği bir e-ticaret uygulamasının Node.js + Supabase tabanlı backend kısmıdır.

---

## ✅ Tamamlanan Özellikler

### 🔐 Kullanıcı & Giriş Sistemi
- Kullanıcı kaydı ve girişi (JWT token)
- Admin & kullanıcı rolleri
- Token doğrulama (`verifyToken`)
- Admin kontrolü (`checkAdmin`)

### 🛒 Sepet ve Sipariş Sistemi
- Sepete ürün ekleme / çıkarma
- Sipariş oluşturma (sepetten aktarım destekli)
- Sipariş iptali (user & admin)
- Sipariş durumu güncelleme (`pending`, `paid`, `cancelled`)
- Kullanıcının sipariş geçmişi
- Admin tüm siparişleri görebilir

### 🧾 Ürün Yönetimi
- Ürün ekleme (admin)
- Ürün güncelleme / stok güncelleme
- Ürün mantıksal silme (`is_visible: false`)
- Kullanıcı sadece görünür ürünleri görür
- Admin tüm ürünleri görebilir
- Admin tek ürünü `GET /products/:id/admin` ile görebilir

### 📊 Diğer
- Ortalama puan hesaplama (`reviews`)
- Siparişlerde ürün fiyatı ve miktar kaydı
- Route sıralamaları Express'e uygun şekilde yapılandırıldı

---

## 📌 Kullanılabilir API Endpointleri

### 🔐 Authentication (Kayıt & Giriş)
| Method | Endpoint             | Açıklama                     |
|--------|----------------------|------------------------------|
| POST   | /api/auth/register   | Kullanıcı kaydı              |
| POST   | /api/auth/login      | Giriş yap, JWT al            |

### 🛍️ Ürünler (Public & Admin)

#### 👤 Kullanıcılar İçin
| Method | Endpoint             | Açıklama                                 |
|--------|----------------------|------------------------------------------|
| GET    | /api/products        | Sadece görünür ürünleri listeler         |
| GET    | /api/products/:id    | Tek ürün (görünürse)                     |

#### 🛡️ Admin İçin
| Method | Endpoint                 | Açıklama                              |
|--------|--------------------------|---------------------------------------|
| GET    | /api/products/all        | Tüm ürünleri listeler (gizliler dahil)|
| GET    | /api/products/:id/admin  | Admin olarak tek ürünü getirir       |
| POST   | /api/products            | Yeni ürün ekler                       |
| PUT    | /api/products/:id        | Ürün bilgilerini günceller            |
| PUT    | /api/products/:id/stock  | Stok bilgisini günceller              |
| DELETE | /api/products/:id        | Ürünü gizler (mantıksal silme)        |

### 🛒 Sepet (Cart)
| Method | Endpoint                | Açıklama                           |
|--------|-------------------------|------------------------------------|
| GET    | /api/cart               | Kullanıcının sepetini getirir      |
| POST   | /api/cart               | Sepete ürün ekler                  |
| PUT    | /api/cart/:product_id   | Sepetteki ürün miktarını günceller |
| DELETE | /api/cart/:product_id   | Sepetten ürünü siler               |

### 📦 Siparişler (Orders)

#### 👤 Kullanıcılar İçin
| Method | Endpoint               | Açıklama                                |
|--------|------------------------|-----------------------------------------|
| POST   | /api/orders            | Sepetten ya da direkt sipariş verir     |
| GET    | /api/orders            | Kullanıcının siparişlerini getirir      |
| GET    | /api/orders/:id        | Tek sipariş detayı                       |
| PATCH  | /api/orders/:id/cancel | Kullanıcı siparişi iptal eder           |

#### 🛡️ Admin İçin
| Method | Endpoint                | Açıklama                          |
|--------|-------------------------|-----------------------------------|
| GET    | /api/orders/all         | Tüm siparişleri listeler          |
| PUT    | /api/orders/:id/status  | Sipariş durumunu günceller        |
| PATCH  | /api/orders/:id/cancel  | Admin siparişi iptal eder         |

### 📝 Yorumlar (Hazır)
| Method | Endpoint                      | Açıklama                  |
|--------|-------------------------------|---------------------------|
| GET    | /api/products/:id/reviews     | Ürüne ait yorumları getir |
| POST   | /api/reviews                  | Yeni yorum ekler          |

---

## 🔜 Yol Haritası

1. Ürün görünürlük güncelleme (admin) +
2. Kullanıcı profil ve adres bilgileri +
3. Sipariş detayında ürün adı/fiyatı görünürlüğü +
4. Admin dashboard için özet istatistikler
5. Ürün arama ve filtreleme
6. Ürün yorumu ve puanlama sistemi
7. Favori ürün sistemi
8. Admin kullanıcı yönetimi
9. Frontend Geliştirmeleri

---

## 🔧 Teknolojiler

- Node.js & Express.js
- Supabase (veri tabanı, auth, storage)
- JWT ile kimlik doğrulama
- Thunder Client (test aracı)

---

## 📁 Supabase Tablolar

- `users` → id, email, password, role
- `crud` → ürünler (name, price, stock, is_visible)
- `cart` → user_id, product_id, quantity
- `orders`, `order_items`
- `reviews`

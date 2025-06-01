# 📊 E-Ticaret Backend – Kod Denetimi ve Öncelik Tablosu

Bu tablo, proje geliştirilmeden önce göz önüne alınması gereken teknik borçları, olası sorunları ve çözüm önerilerini içermektedir. Puanlama 1 (düşük öncelik) ile 5 (yüksek öncelik) arasındadır.

| 📁 Dosya/Kategori       | ⚠️ Sorun Açıklaması                                               | 🎯 Öncelik (1–5) | ✅ Çözüm Önerisi |
|------------------------|------------------------------------------------------------------|------------------|------------------|
| `authController.js` ve `userController.js` | Register / Login işlemleri iki yerde tekrarlanıyor                 | **4**            | İkisi birleştirilmeli. `authController` aktif olarak kullanılacaksa, `userController`'daki auth kısmı kaldırılmalı. |
| `.env`                 | Git kontrolüne dahil değil (iyi)                                 | **0**            | Her şey yolunda. `.gitignore` altında olduğu için sorun yok. |
| `seed.js`              | Şifreler hashlenmeden veriliyor *(aktif kullanılmıyor şu an)*    | **3**            | Eğer ileride kullanılacaksa, `bcrypt.hash(...)` ile şifreler hashlenmeli. |
| `index.js`             | Hatalar tek tip dönüyor (`500 Internal Server Error`)            | **3**            | Ortak `errorHandler.js` dosyası oluşturularak hata türlerine göre yönetim yapılmalı. |
| `cart.js`, `users.js`  | Geliştirme log’ları (`console.log`) hala kodda                   | **2**            | Debug süreci bittiğinde bu log’lar temizlenmeli. |
| `order_items` tablosu  | Ürün ismi sipariş detayına dahil değil                           | **3**            | `product_name_snapshot` gibi alan eklenebilir ya da frontend tarafında ürünler eşlenebilir. |
| `products.js`          | `PUT /:id/stock` ayrı tutulmuş                                   | **2**            | İleride `PATCH /:id` ile birleşebilir. Şu an için çalışır durumda. |
| `emailService.js`      | TLS (`secure`) kapalı                                            | **2**            | SMTP canlıya taşınırsa `secure: true` yapılmalı. Şu an için sorun değil. |
| `supabase.js`          | Test temizliği `anon` client ile yapılmış                        | **2**            | `supabaseAdmin` kullanılması daha güvenli olur. |
| `package.json`         | Swagger, ESLint, Prettier gibi araçlar eksik                     | **1**            | Son aşamada entegre edilebilir. Şu an için gerek yok. |
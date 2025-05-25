# 🛍️ React E-Ticaret Uygulaması

Bu proje, **React** ile geliştirilmiş bir e-ticaret frontend uygulamasıdır. Kullanıcı girişi, ürün listeleme, sepet, favoriler, adres yönetimi, sipariş oluşturma gibi işlevsel alışveriş özellikleri sunar.

---

## 🚀 Kurulum

```bash
git clone <proje-url>
cd e-ticaret-frontend
npm install
npm start
🧱 Proje Yapısı
graphql
Kopyala
Düzenle
src/
├── components/           # UI bileşenleri (Header, ProductCard, vs)
├── context/              # Global state yönetimi (Auth, Cart, Wishlist, Address, Order)
├── models/               # Mock ürün verileri
├── pages/                # Sayfa bileşenleri (HomePage, ProfilePage, vs)
├── routes/               # Giriş korumalı route yapısı
├── services/             # Gelecekteki API entegrasyonu için alan
├── utils/                # Yardımcı fonksiyonlar
✅ Mevcut Özellikler
Özellik	Durum
Kullanıcı Girişi / Kayıt	✅ Tamamlandı
Ürün Listeleme	✅ Tamamlandı
Ürün Detay Sayfası	✅ Tamamlandı
Arama & Kategori Filtresi	✅ Tamamlandı
Fiyat Filtresi	✅ Tamamlandı
Sepet Yönetimi	✅ Tamamlandı
Favori Ürünler	✅ Tamamlandı
Adres Bilgisi Kaydetme	✅ Tamamlandı
Sipariş Oluşturma	✅ Tamamlandı
Sipariş Geçmişi	⛔ Görüntüleme hatalı
Route Koruması (PrivateRoute)	✅ Tamamlandı

✅ Yapılan Geliştirme Adımları
1️⃣ Adres Formu ve Yönetimi
Profil sayfasına adres formu eklendi

localStorage ile kalıcı hale getirildi

Checkout sayfasında otomatik çekiliyor

2️⃣ Checkout & Sipariş Akışı
Sepetteki ürünler + adres + telefonla sipariş veriliyor

Siparişler OrderContext ile kaydediliyor

3️⃣ Favori Ürünler
Favoriye ekleme/kaldırma

Sepete ekleme

Boşsa mesaj gösterimi

4️⃣ Ürün Filtreleme
Kategoriye göre filtreleme

Fiyat aralığı filtresi

Arama kutusu entegrasyonu

“Filtreleri Temizle” butonu

⚠️ Eksik / Geliştirilecek Özellikler
Özellik	Durum
Sipariş geçmişini görüntüleme (OrdersPage)	⛔ Context'ten veri gelmiyor (debug gerek)
Şifre değiştirme / profil düzenleme	⏳ Henüz yok
Ürün sıralama (fiyat A-Z / Z-A)	⏳ Yapılabilir
Stok kontrolü	⏳ Eklenebilir
Kupon kodu / indirim	⏳ Opsiyonel
Yorum sistemi (mock)	⏳ Opsiyonel
Mobil uyumluluk & responsive tasarım	⏳ Yapılabilir
Test altyapısı (unit, context)	⏳ Henüz yok

💡 Notlar
Proje tamamen frontend odaklıdır.

Gelecekte backend (örneğin Firebase, Supabase) entegrasyonu planlanmaktadır.

Kod yapısı clean code, context API, modüler mimari prensiplerine uygun geliştirilmektedir.
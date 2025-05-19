# Supabase Veritabanı Yapısı

## 🧑 users tablosu
- id (uuid, primary key, default: gen_random_uuid())
- email (text, unique)
- password (text)
- role (text, default: user)
- created_at (timestamp, default: now())

## 🛍️ products tablosu
- id (uuid)
- name (text)
- price (numeric)
- description (text)
- image_url (text)

## 🛒 cart tablosu
- id (uuid)
- user_id (uuid)
- product_id (uuid)
- quantity (int)

## 📦 orders tablosu
- id (uuid)
- user_id (uuid)
- total_price (numeric)
- status (text)

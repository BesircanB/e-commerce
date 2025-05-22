// server/seed.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function seed() {
  // Örnek kullanıcılar
  await supabase
    .from('users')
    .delete() // Önce varsa eski verileri temizle
    .neq('email', '');

  await supabase
    .from('users')
    .insert([
      { email: 'musteri@example.com', password: 'user1234', role: 'user' },
      { email: 'deneme@example.com',  password: 'deneme1234',  role: 'user' },
      { email: 'admin@example.com',  password: 'admin1234',  role: 'admin' }
    ]);

  // Örnek ürünler
  await supabase
    .from('crud')
    .delete() // Eski ürünleri sil
    .neq('id', null);

  await supabase
    .from('crud')
    .insert([
      { name: 'Ürün A', description: 'Deneme A', price: 50.0, image_url: null },
      { name: 'Ürün B', description: 'Deneme B', price: 75.0, image_url: null }
    ]);

  console.log('✅ Seed tamamlandı.');
}

seed()
  .catch(err => {
    console.error('Seed hatası:', err);
    process.exit(1);
  })
  .then(() => process.exit());

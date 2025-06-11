const { supabaseAdmin } = require("../services/supabase");

// 1. Stok yeterliliğini kontrol et (fırlatmalı)
async function validateStock(cartItems) {
  for (const item of cartItems) {
    const product = item.crud;
    if (!product) {
      throw new Error(`Ürün bulunamadı: ID ${item.product_id}`);
    }
    if (product.stock < item.quantity) {
      throw new Error(`Yetersiz stok: ${product.stock} adet kaldı (Ürün ID: ${item.product_id})`);
    }
  }
}

// 2. Stokları azalt (sepet tamamlandığında)
async function decreaseStock(cartItems) {
  for (const item of cartItems) {
    const newStock = item.crud.stock - item.quantity;

    const { error } = await supabaseAdmin
      .from("crud")
      .update({ stock: newStock })
      .eq("id", item.product_id);

    if (error) {
      throw new Error(`Stok güncellenemedi (ID: ${item.product_id})`);
    }
  }
}

// 3. Stokları geri yükle (iptal durumunda)
async function restoreStock(orderItems) {
  for (const item of orderItems) {
    // Mevcut stok değerini al
    const { data: product, error: fetchError } = await supabaseAdmin
      .from("crud")
      .select("stock")
      .eq("id", item.product_id)
      .single();

    if (fetchError) {
      throw new Error(`Stok alınamadı (ID: ${item.product_id})`);
    }

    const newStock = product.stock + item.quantity;

    const { error: updateError } = await supabaseAdmin
      .from("crud")
      .update({ stock: newStock })
      .eq("id", item.product_id);

    if (updateError) {
      throw new Error(`Stok iade hatası (ID: ${item.product_id})`);
    }
  }
}

module.exports = {
  validateStock,
  decreaseStock,
  restoreStock,
};

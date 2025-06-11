const { supabaseAdmin } = require("../supabase");

async function addToCart({ userId, productId, quantity }) {
  // Input validation
  if (!userId || !productId || !quantity || quantity <= 0) {
    throw new Error("Geçersiz ürün bilgisi");
  }

  // 1. Önce ürünün varlığını ve stok durumunu kontrol et
  const { data: product, error: productError } = await supabaseAdmin
    .from("crud")
    .select("id, stock, is_visible")
    .eq("id", productId)
    .maybeSingle();

  console.log('Product check:', { product, productError });

  if (productError) throw new Error("Ürün kontrol hatası");
  if (!product) throw new Error("Ürün bulunamadı");
  if (!product.is_visible) throw new Error("Bu ürün satışta değil");
  if (product.stock <= 0) throw new Error("Ürün stokta yok");

  // 2. Sepetteki mevcut ürünü kontrol et
  const { data: existingItem, error: fetchError } = await supabaseAdmin
    .from("cart")
    .select("*")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();

  console.log('Cart check:', { existingItem, fetchError });

  if (fetchError) throw new Error("Sepet kontrol hatası");

  // 3. Toplam miktar stok miktarını geçmemeli
  const totalQuantity = (existingItem?.quantity || 0) + quantity;
  if (totalQuantity > product.stock) {
    throw new Error(`Üzgünüz, sadece ${product.stock} adet stok mevcut`);
  }

  if (existingItem) {
    // Miktarı artır
    const { data: updateData, error: updateError } = await supabaseAdmin
      .from("cart")
      .update({ quantity: totalQuantity })
      .eq("id", existingItem.id)
      .select()
      .single();

    console.log('Update operation:', { updateData, updateError });
    if (updateError) throw new Error("Miktar güncellenemedi");
  } else {
    // Yeni ürün ekle
    const { data: insertData, error: insertError } = await supabaseAdmin
      .from("cart")
      .insert([{ 
        user_id: userId, 
        product_id: productId, 
        quantity 
      }])
      .select()
      .single();

    console.log('Insert operation:', { 
      insertData, 
      insertError,
      insertPayload: { 
        user_id: userId, 
        product_id: productId, 
        quantity 
      }
    });

    if (insertError) {
      console.error('Insert error details:', insertError);
      throw new Error("Sepete ekleme başarısız");
    }
  }

  return { message: "Ürün sepete eklendi" };
}

module.exports = addToCart;

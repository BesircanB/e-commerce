function validateProductId(productId) {
  const id = Number(productId);
  if (!id || isNaN(id) || id <= 0) {
    return "Geçersiz ürün ID";
  }
  return null;
}

// Ürün bilgisi sadece temel alanları içerir
function formatWishlistProduct(product) {
  return {
    id: product.id,
    name: product.name,
    image_url: product.image_url,
    price: product.price,
  };
}

module.exports = {
  validateProductId,
  formatWishlistProduct,
};

function validateProductInput(data) {
  const requiredFields = ["name", "price", "stock"];
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === "") {
      return { error: `${field} alanı zorunludur` };
    }
  }

  if (typeof data.name !== "string" || data.name.trim() === "") {
    return { error: "Ürün adı geçerli değil" };
  }

  if (isNaN(data.price) || Number(data.price) < 0) {
    return { error: "Geçersiz fiyat" };
  }

  if (!Number.isInteger(Number(data.stock)) || data.stock < 0) {
    return { error: "Geçersiz stok miktarı" };
  }

  return { error: null };
}

function sanitizeProductInput(data) {
  return {
    name: data.name?.trim(),
    description: data.description?.trim() || "",
    price: parseFloat(data.price),
    stock: parseInt(data.stock),
    image_url: data.image_url?.trim() || null,
    is_visible: data.is_visible === false ? false : true,
    category_id: data.category_id || null
  };
}


module.exports = {
  validateProductInput,
  sanitizeProductInput
};

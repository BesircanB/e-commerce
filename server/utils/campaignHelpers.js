function validateCampaignInput(data) {
  const requiredFields = [
    "title",
    "discount_type",
    "discount_value",
    "start_date",
    "end_date"
  ];

  for (const field of requiredFields) {
    if (
      data[field] === undefined ||
      data[field] === null ||
      data[field] === ""
    ) {
      return { error: `${field} alanı zorunludur` };
    }
  }

  const allowedTypes = ["percentage", "amount"];
  if (!allowedTypes.includes(data.discount_type)) {
    return { error: "İndirim tipi 'percentage' veya 'amount' olmalıdır" };
  }

  const parsedValue = Number(data.discount_value);
  if (isNaN(parsedValue) || parsedValue <= 0) {
    return { error: "İndirim değeri pozitif bir sayı olmalıdır" };
  }

  const start = new Date(data.start_date);
  const end = new Date(data.end_date);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { error: "Geçerli bir başlangıç ve bitiş tarihi giriniz" };
  }
  if (start > end) {
    return { error: "Başlangıç tarihi bitiş tarihinden sonra olamaz" };
  }

  // category_ids ve tag_ids array ise sorun yok, varsa tipini kontrol et
  if (data.category_ids && !Array.isArray(data.category_ids)) {
    return { error: "category_ids bir dizi olmalıdır" };
  }
  if (data.tag_ids && !Array.isArray(data.tag_ids)) {
    return { error: "tag_ids bir dizi olmalıdır" };
  }

  return { error: null };
}

function sanitizeCampaignInput(data) {
  return {
    title: data.title?.trim(),
    description: data.description?.trim() || null,
    discount_type: data.discount_type,
    discount_value: Number(data.discount_value),
    min_order_amount: data.min_order_amount ? Number(data.min_order_amount) : 0,
    start_date: new Date(data.start_date).toISOString(),
    end_date: new Date(data.end_date).toISOString(),
    is_active: data.is_active === false ? false : true,
    code: data.code ? data.code.trim().toUpperCase() : null,
    apply_type: data.apply_type || "auto",
    category_ids: Array.isArray(data.category_ids) ? data.category_ids : [],
    tag_ids: Array.isArray(data.tag_ids) ? data.tag_ids : []
  };
}

module.exports = {
  validateCampaignInput,
  sanitizeCampaignInput,
};

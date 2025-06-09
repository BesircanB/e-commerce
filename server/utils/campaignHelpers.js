function validateCampaignInput(data) {
  const requiredFields = ["code", "discount_type", "discount_value", "expires_at"];

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

  const expiry = new Date(data.expires_at);
  if (isNaN(expiry.getTime())) {
    return { error: "Geçerli bir bitiş tarihi giriniz" };
  }

  return { error: null };
}

function sanitizeCampaignInput(data) {
  return {
    code: data.code?.trim().toUpperCase(),
    discount_type: data.discount_type,
    discount_value: Number(data.discount_value),
    is_active: data.is_active === false ? false : true,
    expires_at: new Date(data.expires_at).toISOString(),
  };
}

module.exports = {
  validateCampaignInput,
  sanitizeCampaignInput,
};

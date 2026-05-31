export const formatOrderId = (id) => {
  if (!id) return "";
  return `#QB-${String(id).padStart(4, '0')}`;
};

export const formatPrice = (price) => {
  const parsed = parseFloat(price);
  return isNaN(parsed) ? "$0.00" : `$${parsed.toFixed(2)}`;
};

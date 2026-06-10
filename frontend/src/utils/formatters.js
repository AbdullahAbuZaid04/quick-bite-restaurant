export const formatOrderId = (id) => {
  if (!id) return "";
  return `#QB-${String(id).padStart(4, '0')}`;
};

export const formatPrice = (price) => {
  const parsed = parseFloat(price);
  return isNaN(parsed) ? "$0.00" : `$${parsed.toFixed(2)}`;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const serverDate = new Date(dateStr.includes('UTC') ? dateStr : dateStr + ' UTC');
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  };

  return serverDate.toLocaleString('en-GB', options).replace(',', ' |');
};

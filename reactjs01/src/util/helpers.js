export const formatPrice = (price) => {
  if (price === undefined || price === null) return '$0.00';
  
  // Try to parse the price to number if it's string
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numPrice)) return '$0.00';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(numPrice);
};

export const mapOrderStatus = (status) => {
  const map = {
    'new': { label: 'Mới', color: 'warning' },
    'confirmed': { label: 'Đã xác nhận', color: 'indigo' },
    'preparing': { label: 'Đang chuẩn bị', color: 'orange' },
    'shipping': { label: 'Đang giao', color: 'processing' },
    'delivered': { label: 'Đã giao', color: 'success' },
    'cancelled': { label: 'Đã hủy', color: 'error' }
  };
  return map[status] || { label: status, color: 'default' };
};

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

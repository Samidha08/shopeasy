export const USD_TO_INR_RATE = 95;

export const convertUsdToInr = (amount = 0) =>
  Math.round(amount * USD_TO_INR_RATE);

export const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

export const formatUsdAsInr = (usdAmount = 0) =>
  formatCurrency(convertUsdToInr(usdAmount));
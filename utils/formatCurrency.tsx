export const formatCurrency = (
  value: number,
  locale: string = 'en-PH',
  currency: string = 'PHP',
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
};

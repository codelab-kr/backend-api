export function getDefaultFractionDigits(currencyCode: string) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  });
  const parts = formatter.formatToParts(123);
  const fraction = parts.find((m) => m.type === 'fraction');
  return fraction ? fraction.value.length : 0;
}

export function roundToDigits(num: number, point: number): number {
  return Number(num.toFixed(point));
}

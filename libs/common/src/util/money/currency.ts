export function getDefaultFractionDigits(currencyCode: string) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  });
  const parts = formatter.formatToParts(123);
  const fraction = parts.find((m) => m.type === 'fraction');
  return fraction ? fraction.value.length : 0;
}

// console.log(getDefaultFractionDigits('USD')); // Output: 2
// console.log(getDefaultFractionDigits('JPY')); // Output: 0
// console.log(getDefaultFractionDigits('KRW')); // Output: 0

export function roundToDigits(num: number, point: number): number {
  return Number(num.toFixed(point));
}

// console.log(roundTo12Digits(1.123456789012545)); // Output: 1.123456789013

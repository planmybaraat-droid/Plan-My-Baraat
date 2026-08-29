// Converts a rupee amount into words using the Indian numbering system
// (Hundred / Thousand / Lakh / Crore), for printing "Amount in words" on
// PDFs (invoices, agreements, quotations, receipts). Pure, deterministic,
// no dependency on Intl -- safe to call during SSR and on the client alike.

const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen',
];

const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function twoDigitsInWords(n: number): string {
  if (n < 20) return ONES[n];
  const tens = TENS[Math.floor(n / 10)];
  const ones = n % 10;
  return ones ? `${tens}-${ONES[ones]}` : tens;
}

function threeDigitsInWords(n: number): string {
  let out = '';
  if (n >= 100) {
    out += `${ONES[Math.floor(n / 100)]} Hundred`;
    n %= 100;
    if (n) out += ' ';
  }
  if (n) out += twoDigitsInWords(n);
  return out;
}

// Whole (non-negative integer) number -> Indian-system words, e.g.
// 1250075 -> "Twelve Lakh Fifty Thousand Seventy-Five".
function integerInWords(value: number): string {
  if (value === 0) return 'Zero';

  const crore = Math.floor(value / 10000000);
  value %= 10000000;
  const lakh = Math.floor(value / 100000);
  value %= 100000;
  const thousand = Math.floor(value / 1000);
  value %= 1000;
  const hundred = value;

  const parts: string[] = [];
  if (crore) parts.push(`${threeDigitsInWords(crore)} Crore`);
  if (lakh) parts.push(`${threeDigitsInWords(lakh)} Lakh`);
  if (thousand) parts.push(`${threeDigitsInWords(thousand)} Thousand`);
  if (hundred) parts.push(threeDigitsInWords(hundred));

  return parts.join(' ');
}

// Formats a rupee amount (number, possibly with paise) as the standard
// "Rupees ... Only" words line used on Indian invoices, agreements,
// quotations and receipts. Never throws: a missing/invalid value is
// treated as zero rather than producing "NaN" or a blank line on a
// printed, otherwise-final document.
export function amountInWordsINR(value: number | string | null | undefined): string {
  const raw = Number(value);
  const safe = Number.isFinite(raw) ? raw : 0;
  const isNegative = safe < 0;
  const rounded = Math.round(Math.abs(safe) * 100) / 100;
  const rupees = Math.floor(rounded);
  const paise = Math.round((rounded - rupees) * 100);

  let words = `Rupees ${integerInWords(rupees)}`;
  if (paise > 0) {
    words += ` and ${integerInWords(paise)} Paise`;
  }
  words += ' Only';

  return isNegative ? `Minus ${words}` : words;
}

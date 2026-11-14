// Taka amounts in words for vouchers, using the Bangladeshi grouping (crore, lakh, thousand).

const ONES = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

/** 0–99 */
function twoDigits(value: number): string {
    if (value < 20) return ONES[value];
    return [TENS[Math.floor(value / 10)], ONES[value % 10]].filter(Boolean).join(" ");
}

/** 0–999 */
function threeDigits(value: number): string {
    const hundreds = Math.floor(value / 100);
    const rest = value % 100;
    return [hundreds ? `${ONES[hundreds]} Hundred` : "", rest ? twoDigits(rest) : ""].filter(Boolean).join(" ");
}

function wholeInWords(value: number): string {
    if (value === 0) return "Zero";
    const crore = Math.floor(value / 10_000_000);
    const lakh = Math.floor((value % 10_000_000) / 100_000);
    const thousand = Math.floor((value % 100_000) / 1000);
    const rest = value % 1000;
    return [
        crore ? `${wholeInWords(crore)} Crore` : "",
        lakh ? `${twoDigits(lakh)} Lakh` : "",
        thousand ? `${twoDigits(thousand)} Thousand` : "",
        rest ? threeDigits(rest) : "",
    ].filter(Boolean).join(" ");
}

/** 13000 → "Thirteen Thousand Taka Only"; 1250.5 → "One Thousand Two Hundred Fifty Taka and Fifty Paisa Only". */
export function takaInWords(amount: number): string {
    if (!Number.isFinite(amount)) return "-";
    const paisaTotal = Math.round(Math.abs(amount) * 100);
    const taka = Math.floor(paisaTotal / 100);
    const paisa = paisaTotal % 100;
    const words = `${wholeInWords(taka)} Taka${paisa ? ` and ${twoDigits(paisa)} Paisa` : ""} Only`;
    return amount < 0 ? `Minus ${words}` : words;
}

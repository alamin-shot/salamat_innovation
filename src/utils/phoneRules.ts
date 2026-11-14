// Bangladesh mobile numbers: +8801XXXXXXXXX, 8801XXXXXXXXX, 008801XXXXXXXXX and 01XXXXXXXXX are the same number.

const BD_MOBILE = /^01[3-9]\d{8}$/;

/**
 * Canonical local form "01XXXXXXXXX", or null when the text is not a valid BD mobile number.
 * Spaces, dashes, dots and brackets are ignored.
 */
export function normalizeBdPhone(raw: string): string | null {
    const digits = raw.replace(/[\s\-().]/g, "").replace(/^\+/, "");
    const local = digits.replace(/^(?:00)?880(?=1)/, "0");
    return BD_MOBILE.test(local) ? local : null;
}

/** True when both are valid and the same number. */
export function isSamePhone(a: string, b: string): boolean {
    const left = normalizeBdPhone(a);
    return left !== null && left === normalizeBdPhone(b);
}

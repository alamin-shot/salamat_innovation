// One reader for every date format the ERP's stores hold, so records from different modules can be ordered.
// All local dates are read as Asia/Dhaka (+06:00).

const MONTHS: Record<string, string> = {
    jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
    jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
};

const pad = (value: string | number) => String(value).padStart(2, "0");

/**
 * ISO-8601 for: ISO strings, "2026-10-18", "18-10-2026", "18 Oct 2026", "26 Oct 2026 10:28 PM".
 * Date-only values are placed at 00:00 Dhaka time. Returns null for anything else.
 */
export function toIsoDate(value: string | null | undefined): string | null {
    const text = value?.trim();
    if (!text) return null;

    if (/^\d{4}-\d{2}-\d{2}T/.test(text)) {
        return Number.isNaN(Date.parse(text)) ? null : text;
    }
    let match = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) return `${match[1]}-${match[2]}-${match[3]}T00:00:00+06:00`;

    match = text.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (match) return `${match[3]}-${match[2]}-${match[1]}T00:00:00+06:00`;

    match = text.match(/^(\d{1,2})\s+([A-Za-z]{3})[a-z]*\s+(\d{4})(?:\s+(\d{1,2}):(\d{2})\s*(AM|PM))?$/i);
    if (match) {
        const month = MONTHS[match[2].toLowerCase()];
        if (!month) return null;
        let hours = match[4] ? Number(match[4]) % 12 : 0;
        if (match[6]?.toUpperCase() === "PM") hours += 12;
        return `${match[3]}-${month}-${pad(match[1])}T${pad(hours)}:${match[5] ?? "00"}:00+06:00`;
    }
    return null;
}

/** Milliseconds for sorting; unknown dates sort first. */
export const toTimestamp = (iso: string | null): number => (iso ? Date.parse(iso) : 0);

/** True when the value is already a full ISO-8601 timestamp. */
export const isIsoTimestamp = (value: string): boolean => /^\d{4}-\d{2}-\d{2}T/.test(value) && !Number.isNaN(Date.parse(value));

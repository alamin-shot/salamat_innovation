// UI-only date formatting. Stores always hold ISO-8601; these helpers only decide how it reads on screen.
import { format, formatDistanceToNow } from "date-fns";

const parse = (iso: string | null | undefined): Date | null => {
    if (!iso) return null;
    const date = new Date(iso);
    return Number.isNaN(date.getTime()) ? null : date;
};

/** "2 hours ago", or "-" for a missing / unreadable date. */
export function formatRelative(iso: string | null | undefined): string {
    const date = parse(iso);
    return date ? formatDistanceToNow(date, { addSuffix: true }) : "-";
}

/** "14 Nov 2026, 10:28 PM" — for tooltips beside a relative date. */
export function formatAbsolute(iso: string | null | undefined): string {
    const date = parse(iso);
    return date ? format(date, "dd MMM yyyy, hh:mm a") : "-";
}

/** "18 Oct 2026" — calendar day for financial records. */
export function formatDay(iso: string | null | undefined): string {
    const date = parse(iso);
    return date ? format(date, "dd MMM yyyy") : "-";
}

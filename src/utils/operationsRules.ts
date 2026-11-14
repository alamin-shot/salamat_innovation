import { OperationApprovalStatus, OperationSerial, OperationsError, OperationsShop } from "@/types/operations";
import { OPERATIONS_SHOPS } from "@/constants/operations";

// Pure rules shared by the Stock Transfer, Damage Products and Cash Transfer stores.

/** Next number in a "ST-000353" style series (6 digits, like the existing records). */
export function nextOperationRef(prefix: "ST" | "DMG" | "CT", existing: string[]): string {
    const highest = existing.reduce((max, ref) => {
        const match = ref.match(/^[A-Z]+-(\d+)$/);
        return match && ref.startsWith(`${prefix}-`) ? Math.max(max, Number(match[1])) : max;
    }, 0);
    return `${prefix}-${String(highest + 1).padStart(6, "0")}`;
}

/** First problem with a serial list, or null. Serials compare trimmed and case-insensitive. */
export function serialListError(serials: OperationSerial[]): OperationsError | null {
    if (serials.length === 0) {
        return "serials_required";
    }
    const keys = serials.map((serial) => serial.serialNo.trim().toUpperCase());
    return new Set(keys).size === keys.length ? null : "serial_duplicate";
}

/** Approve / cancel is a one-way step out of Draft. */
export function canDecide(status: OperationApprovalStatus): boolean {
    return status === "Draft";
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** ISO → "08-Oct-2026 07:34 PM", the Created At format the current tables show (local time). */
export function formatOperationTimestamp(iso: string): string {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
        return iso;
    }
    const hours24 = date.getHours();
    const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
    const pad = (value: number) => String(value).padStart(2, "0");
    return `${pad(date.getDate())}-${MONTHS[date.getMonth()]}-${date.getFullYear()} ${pad(hours12)}:${pad(date.getMinutes())} ${hours24 < 12 ? "AM" : "PM"}`;
}

/** Taka sum without float drift (whole paisa). */
export function sumAmounts(values: number[]): number {
    return values.reduce((sum, value) => sum + Math.round(value * 100), 0) / 100;
}

/** Narrows a dropdown value to a known shop. */
export function isOperationsShop(value: string): value is OperationsShop {
    return (OPERATIONS_SHOPS as readonly string[]).includes(value);
}

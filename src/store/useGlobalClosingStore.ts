import { create } from "zustand";
import { persist } from "zustand/middleware";

// --- CORE TYPES ---
export type TenderType = "Cash" | "Bkash" | "POS";
export type ClosingStatus = "open" | "submitted" | "locked";

export interface TenderMatrix {
    cash: number;
    bkash: number;
    pos: number;
}

export interface DenominationTally {
    1000: number; 500: number; 200: number; 100: number;
    50: number; 20: number; 10: number; 5: number; 2: number; 1: number;
}

export interface DayClosingRecord {
    date: string; // YYYY-MM-DD
    status: ClosingStatus;
    preparedBy: string | null;
    approvedBy: string | null;
    actualTenders: TenderMatrix;
    denominations: DenominationTally;
    note: string;
}

// Generic Transaction Type representing the rows in your screenshots
export interface ClosingTransaction {
    id: string;
    date: string;
    invoiceNumber: string;
    party: string;
    sellerOrCreator: string;
    paymentMethod: TenderType | "-";
    total: number;
    paidAmount: number;
    dueAmount: number;
    status: "Paid" | "Partially_paid" | "Due" | "-";
}

interface GlobalClosingState {
    // 1. Immutability & Daily States
    closingRecords: Record<string, DayClosingRecord>;

    // 2. The 12 Transaction Ledgers
    sales: ClosingTransaction[];
    purchases: ClosingTransaction[];
    expenses: ClosingTransaction[];
    withdrawals: ClosingTransaction[];
    deposits: ClosingTransaction[];
    salesReturns: ClosingTransaction[];
    purchaseReturns: ClosingTransaction[];
    profitLoss: ClosingTransaction[];
    balanceSheets: ClosingTransaction[];
    stockStatements: ClosingTransaction[];
    dailyClosingBalances: ClosingTransaction[];

    // 3. Actions
    updateActualTender: (date: string, tender: TenderType, amount: number) => void;
    updateDenomination: (date: string, note: keyof DenominationTally, count: number) => void;
    submitClosing: (date: string, user: string, note: string) => void;
    approveAndLockClosing: (date: string, adminUser: string) => void;
    unlockClosing: (date: string, adminUser: string) => void; // For admin overrides
}

// Helper to initialize a fresh day
const getEmptyClosingRecord = (date: string): DayClosingRecord => ({
    date, status: "open", preparedBy: null, approvedBy: null, note: "",
    actualTenders: { cash: 0, bkash: 0, pos: 0 },
    denominations: { 1000: 0, 500: 0, 200: 0, 100: 0, 50: 0, 20: 0, 10: 0, 5: 0, 2: 0, 1: 0 }
});

export const useGlobalClosingStore = create<GlobalClosingState>()(
    persist(
        (set) => ({
            closingRecords: {},

            // --- MOCK DATA (Matches Screenshots for Nov 6, 2026) ---
            sales: [
                { id: "S1", date: "2026-11-06", invoiceNumber: "PS-003404", party: "Humayon Kabir", sellerOrCreator: "Md Heron Mia", paymentMethod: "Cash", total: 24300, paidAmount: 24300, dueAmount: 0, status: "Paid" },
                { id: "S2", date: "2026-11-06", invoiceNumber: "PS-003405", party: "Anamul", sellerOrCreator: "Md Heron Mia", paymentMethod: "POS", total: 1700, paidAmount: 1700, dueAmount: 0, status: "Paid" },
                { id: "S3", date: "2026-11-06", invoiceNumber: "PS-003406", party: "maisha mehedi", sellerOrCreator: "Jannat Ull Naeem Sarah", paymentMethod: "Bkash", total: 1500, paidAmount: 500, dueAmount: 1000, status: "Partially_paid" },
                { id: "S4", date: "2026-11-06", invoiceNumber: "PS-003407", party: "এনামুল হক জসিম", sellerOrCreator: "Jannat Ull Naeem Sarah", paymentMethod: "Bkash", total: 14500, paidAmount: 1000, dueAmount: 13500, status: "Partially_paid" }
            ],
            purchases: [
                { id: "P1", date: "2026-11-06", invoiceNumber: "PP-001658", party: "huge Collection", sellerOrCreator: "Md Zihadul Islam Sazzad", paymentMethod: "-", total: 23700, paidAmount: 0, dueAmount: 23700, status: "Due" }
            ],
            expenses: [],
            withdrawals: [
                { id: "W1", date: "2026-11-06", invoiceNumber: "WTH-908", party: "Anamul", sellerOrCreator: "Md Zihadul Islam Sazzad", paymentMethod: "POS", total: 1700, paidAmount: 1700, dueAmount: 0, status: "Paid" },
                { id: "W2", date: "2026-11-06", invoiceNumber: "WTH-909", party: "maisha mehedi", sellerOrCreator: "Jannat Ull Naeem Sarah", paymentMethod: "Bkash", total: 500, paidAmount: 500, dueAmount: 0, status: "Paid" },
                { id: "W3", date: "2026-11-06", invoiceNumber: "WTH-910", party: "এনামুল হক জসিম", sellerOrCreator: "Jannat Ull Naeem Sarah", paymentMethod: "Bkash", total: 1000, paidAmount: 1000, dueAmount: 0, status: "Paid" }
            ],
            deposits: [],
            salesReturns: [],
            purchaseReturns: [],
            profitLoss: [],
            balanceSheets: [],
            stockStatements: [],
            dailyClosingBalances: [],

            // --- ACTIONS ---
            updateActualTender: (date, tender, amount) => set((state) => {
                const record = state.closingRecords[date] || getEmptyClosingRecord(date);
                if (record.status !== "open") return state; // Block edits if locked/submitted
                return {
                    closingRecords: { ...state.closingRecords, [date]: { ...record, actualTenders: { ...record.actualTenders, [tender.toLowerCase()]: amount } } }
                };
            }),

            updateDenomination: (date, note, count) => set((state) => {
                const record = state.closingRecords[date] || getEmptyClosingRecord(date);
                if (record.status !== "open") return state;
                return {
                    closingRecords: { ...state.closingRecords, [date]: { ...record, denominations: { ...record.denominations, [note]: count } } }
                };
            }),

            submitClosing: (date, user, note) => set((state) => {
                const record = state.closingRecords[date] || getEmptyClosingRecord(date);
                return { closingRecords: { ...state.closingRecords, [date]: { ...record, status: "submitted", preparedBy: user, note } } };
            }),

            approveAndLockClosing: (date, adminUser) => set((state) => {
                const record = state.closingRecords[date] || getEmptyClosingRecord(date);
                return { closingRecords: { ...state.closingRecords, [date]: { ...record, status: "locked", approvedBy: adminUser } } };
            }),

            unlockClosing: (date, adminUser) => set((state) => {
                const record = state.closingRecords[date] || getEmptyClosingRecord(date);
                return { closingRecords: { ...state.closingRecords, [date]: { ...record, status: "open", approvedBy: null, preparedBy: null } } };
            })
        }),
        {
            name: "erp-closing-storage-v1",
        }
    )
);
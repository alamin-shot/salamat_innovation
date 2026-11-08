import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ClosingTransaction, DayClosingRecord, DailyBankRecord } from "@/types/daily_closing";

interface GlobalClosingState {
    // Legacy Arrays
    sales: ClosingTransaction[];
    purchases: ClosingTransaction[];
    salesReturns: ClosingTransaction[];
    purchaseReturns: ClosingTransaction[];
    expenses: ClosingTransaction[];
    withdrawals: ClosingTransaction[];
    deposits: ClosingTransaction[];

    // Other arrays missing from interface but present in your mock data
    profitLoss: any[];
    balanceSheets: any[];
    stockStatements: any[];
    dailyClosingBalances: any[];

    // Day State Record
    closingRecords: Record<string, DayClosingRecord>;

    // --- NEW: DAILY BANK ARRAY ---
    dailyBankRecords: DailyBankRecord[];
    addDailyBankRecord: (record: Omit<DailyBankRecord, "id">) => void;
    updateDailyBankRecord: (id: string, updates: Partial<DailyBankRecord>) => void;
    deleteDailyBankRecords: (ids: string[]) => void;
    markBankRecordsStatus: (ids: string[], status: "Pending" | "Reconciled") => void;

    // Legacy Mutations
    updateActualTender: (date: string, tender: string, amount: number) => void;
    updateDenomination: (date: string, note: number, count: number) => void;
    submitClosing: (date: string, user: string, note: string) => void;
    approveAndLockClosing: (date: string, adminUser: string) => void;
    unlockClosing: (date: string, adminUser: string) => void;
}

const getEmptyClosingRecord = (date: string): DayClosingRecord => ({
    date, status: "open", preparedBy: null, approvedBy: null, note: "",
    actualTenders: { cash: 0, bkash: 0, pos: 0 },
    denominations: { 1000: 0, 500: 0, 200: 0, 100: 0, 50: 0, 20: 0, 10: 0, 5: 0, 2: 0, 1: 0 }
});

export const useGlobalClosingStore = create<GlobalClosingState>()(
    persist(
        (set) => ({
            closingRecords: {} as Record<string, DayClosingRecord>,

            // --- MOCK DATA (Matches Screenshots for Nov 6, 2026) ---
            sales: [
                { id: "S1", date: "2026-11-06", invoiceNumber: "PS-003404", party: "Humayon Kabir", sellerOrCreator: "Md Heron Mia", paymentMethod: "Cash", total: 24300, paidAmount: 24300, dueAmount: 0, status: "Paid" },
                { id: "S2", date: "2026-11-06", invoiceNumber: "PS-003405", party: "Anamul", sellerOrCreator: "Md Heron Mia", paymentMethod: "POS", total: 1700, paidAmount: 1700, dueAmount: 0, status: "Paid" },
                { id: "S3", date: "2026-11-06", invoiceNumber: "PS-003406", party: "maisha mehedi", sellerOrCreator: "Jannat Ull Naeem Sarah", paymentMethod: "Bkash", total: 1500, paidAmount: 500, dueAmount: 1000, status: "Partially_paid" },
                { id: "S4", date: "2026-11-06", invoiceNumber: "PS-003407", party: "এনামুল হক জসিম", sellerOrCreator: "Jannat Ull Naeem Sarah", paymentMethod: "Bkash", total: 14500, paidAmount: 1000, dueAmount: 13500, status: "Partially_paid" }
            ] as ClosingTransaction[],

            purchases: [
                { id: "P1", date: "2026-11-06", invoiceNumber: "PP-001658", party: "huge Collection", sellerOrCreator: "Md Zihadul Islam Sazzad", paymentMethod: "-", total: 23700, paidAmount: 0, dueAmount: 23700, status: "Due" }
            ] as ClosingTransaction[],

            withdrawals: [
                { id: "W1", date: "2026-11-06", invoiceNumber: "WTH-908", party: "Anamul", sellerOrCreator: "Md Zihadul Islam Sazzad", paymentMethod: "POS", total: 1700, paidAmount: 1700, dueAmount: 0, status: "Paid" },
                { id: "W2", date: "2026-11-06", invoiceNumber: "WTH-909", party: "maisha mehedi", sellerOrCreator: "Jannat Ull Naeem Sarah", paymentMethod: "Bkash", total: 500, paidAmount: 500, dueAmount: 0, status: "Paid" },
                { id: "W3", date: "2026-11-06", invoiceNumber: "WTH-910", party: "এনামুল হক জসিম", sellerOrCreator: "Jannat Ull Naeem Sarah", paymentMethod: "Bkash", total: 1000, paidAmount: 1000, dueAmount: 0, status: "Paid" }
            ] as ClosingTransaction[],

            // CRITICAL FIX: Explicit type casting for all empty arrays
            expenses: [] as ClosingTransaction[],
            deposits: [] as ClosingTransaction[],
            salesReturns: [] as ClosingTransaction[],
            purchaseReturns: [] as ClosingTransaction[],
            profitLoss: [] as any[],
            balanceSheets: [] as any[],
            stockStatements: [] as any[],
            dailyClosingBalances: [] as any[],
            dailyBankRecords: [] as DailyBankRecord[],

            // Bank Mutations
            addDailyBankRecord: (record) => set((state) => ({
                dailyBankRecords: [{ ...record, id: `BNK-${Date.now()}` }, ...state.dailyBankRecords]
            })),
            updateDailyBankRecord: (id, updates) => set((state) => ({
                dailyBankRecords: state.dailyBankRecords.map(record =>
                    record.id === id ? { ...record, ...updates } : record
                )
            })),
            deleteDailyBankRecords: (ids) => set((state) => ({
                dailyBankRecords: state.dailyBankRecords.filter(record => !ids.includes(record.id))
            })),
            markBankRecordsStatus: (ids, status) => set((state) => ({
                dailyBankRecords: state.dailyBankRecords.map(record =>
                    ids.includes(record.id) ? { ...record, status } : record
                )
            })),

            // --- ACTIONS ---
            updateActualTender: (date, tender, amount) => set((state) => {
                const record = state.closingRecords[date] || getEmptyClosingRecord(date);
                if (record.status !== "open") return state;
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
            name: "erp-closing-storage-v1", // Note: you might want to bump this to v2 if you face caching issues during dev
        }
    )
);
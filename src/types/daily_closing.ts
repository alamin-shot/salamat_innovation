export type TenderMatrix = {
    cash: number;
    bkash: number;
    pos: number;
};
export type TenderType = "cash" | "bkash" | "pos";
export interface ClosingTransaction {
    id: string;
    date: string;
    invoiceNumber: string;
    party: string;
    sellerOrCreator: string;
    paymentMethod: "Cash" | "Bkash" | "POS" | "-" | string;
    total: number;
    paidAmount: number;
    dueAmount: number;
    status: "Paid" | "Partially_paid" | "Due" | string;
}

export interface DayState {
    status: "open" | "submitted" | "locked";
    actualTenders: TenderMatrix;
    denominations: {
        1000: number; 500: number; 200: number; 100: number;
        50: number; 20: number; 10: number; 5: number; 2: number; 1: number;
    };
}

export type DenominationTally = {
    1000: number; 500: number; 200: number; 100: number;
    50: number; 20: number; 10: number; 5: number; 2: number; 1: number;
};

// 2. Update DayClosingRecord to use it:
export interface DayClosingRecord {
    date: string;
    status: "open" | "submitted" | "locked";
    preparedBy: string | null;
    approvedBy: string | null;
    note: string;
    actualTenders: TenderMatrix;
    denominations: DenominationTally;
}

// --- NEW DAILY BANK TYPES ---
// Daily Bank Types
export type BankTransactionType = "Deposit" | "Withdrawal" | "Transfer";
export type ReconciliationStatus = "Pending" | "Reconciled";

export interface DailyBankRecord {
    id: string;
    date: string;
    bankAccount: string;
    transactionType: BankTransactionType;
    amount: number;
    referenceNumber: string;
    status: ReconciliationStatus;
    notes: string;
}
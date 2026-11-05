import { create } from "zustand";
import { persist } from "zustand/middleware";

// --- ENGINNERED TYPES ---
export interface LedgerAccount {
    id: string;
    name: string;
    type: "Client" | "Vendor" | "Employee" | "Bank";
    phone: string;
    email: string;
    creditLimit: number;
    // Base balance is derived dynamically, but we can store opening balance
    openingBalance: number;
}

export interface TransactionLineItem {
    id: string;
    coaId: string; // Chart of Accounts ID
    costCenterId?: string;
    description: string;
    amount: number;
}

export interface LedgerTransaction {
    id: string;
    accountId: string;
    date: string;
    type: "Debit" | "Credit";
    paymentMethod: "Cash" | "Bank Transfer" | "Check" | "Mobile Money";
    status: "Pending" | "Cleared" | "Bounced" | "Locked";

    // Maker-Checker Security
    makerChecker: {
        makerId: string;
        checkerId?: string;
        approvedAt?: string;
        isHighValue: boolean;
    };

    // Tax Engine
    taxData?: {
        isTaxInclusive: boolean;
        taxRate: number;
        taxAmount: number;
        netAmount: number;
    };

    // Multi-Currency
    currencyData?: {
        currencyCode: string;
        exchangeRate: number;
        foreignAmount: number;
        baseAmount: number;
    };

    // Core Data
    totalAmount: number;
    referenceNumber?: string; // Check or transaction ID
    lineItems: TransactionLineItem[];
    attachments: string[]; // Array of URL strings for receipts
}

export interface AuditLog {
    id: string;
    transactionId: string;
    action: "CREATE" | "UPDATE_STATUS" | "DELETE" | "MAKER_APPROVED";
    userId: string;
    timestamp: string;
    details: string;
}

interface LedgerStore {
    accounts: LedgerAccount[];
    transactions: LedgerTransaction[];
    chartOfAccounts: { id: string; code: string; name: string; category: string }[];
    costCenters: { id: string; name: string; branchCode: string }[];
    auditLogs: AuditLog[];

    // Actions
    addTransaction: (tx: LedgerTransaction) => void;
    updateTransactionStatus: (id: string, status: LedgerTransaction["status"], userId: string) => void;
    addAuditLog: (log: AuditLog) => void;
}

export const useGlobalLedgerStore = create<LedgerStore>()(
    persist(
        (set) => ({
            accounts: [
                { id: "ACC-001", name: "Mohammed Nahid Islam", type: "Client", phone: "01711478357", email: "nahid@gmail.com", creditLimit: 50000, openingBalance: 0 },
                { id: "ACC-002", name: "Arafat", type: "Client", phone: "01355888668", email: "arafat@gmail.com", creditLimit: 100000, openingBalance: 0 },
            ],
            transactions: [
                {
                    id: "TXN-1001",
                    accountId: "ACC-002",
                    date: "2026-11-05T10:00:00Z",
                    type: "Debit",
                    paymentMethod: "Bank Transfer",
                    status: "Cleared",
                    totalAmount: 39500,
                    referenceNumber: "SLT-3713",
                    makerChecker: { makerId: "ADMIN_1", isHighValue: false },
                    lineItems: [{ id: "LI-1", coaId: "COA-4001", description: "Payment Received", amount: 39500 }],
                    attachments: []
                }
            ],
            chartOfAccounts: [
                { id: "COA-1001", code: "1000", name: "Cash on Hand", category: "Asset" },
                { id: "COA-4001", code: "4000", name: "Sales Revenue", category: "Revenue" }
            ],
            costCenters: [
                { id: "CC-HQ", name: "Headquarters", branchCode: "DHAKA-01" },
                { id: "CC-RTL", name: "Jamuna Showroom", branchCode: "DHAKA-02" }
            ],
            auditLogs: [],

            addTransaction: (tx) => set((state) => ({ transactions: [tx, ...state.transactions] })),
            updateTransactionStatus: (id, status, userId) => set((state) => {
                const txIndex = state.transactions.findIndex(t => t.id === id);
                if (txIndex === -1) return state;

                const updatedTx = [...state.transactions];
                const oldStatus = updatedTx[txIndex].status;
                updatedTx[txIndex].status = status;

                const newAudit: AuditLog = {
                    id: `AUDIT-${Date.now()}`,
                    transactionId: id,
                    action: "UPDATE_STATUS",
                    userId,
                    timestamp: new Date().toISOString(),
                    details: `Status changed from ${oldStatus} to ${status}`
                };

                return { transactions: updatedTx, auditLogs: [newAudit, ...state.auditLogs] };
            }),
            addAuditLog: (log) => set((state) => ({ auditLogs: [log, ...state.auditLogs] }))
        }),
        {
            name: "erp-ledger-storage-v2"
        }
    )
);
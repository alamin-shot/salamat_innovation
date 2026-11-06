import { create } from "zustand";
import { persist } from "zustand/middleware";

// --- CORE INTERFACES ---
export interface SaleReportRecord {
    id: string;
    date: string;
    invoiceNumber: string;
    customer: string;
    totalItem: number;
    totalAmount: number;
    dueAmount: number;
    receivedAmount: number;
    seller: string;
    status: "Paid" | "Due" | "Partially_Paid";
    createdBy: string;
}

export interface ProfitLossRecord {
    id: string;
    date: string;
    invoiceNumber: string;
    product: string;
    seller: string;
    createdBy: string;
    status: "Paid" | "Due";
    totalSale: number;
    totalPurchase: number;
    profitLoss: number;
}

export interface DamageRecord {
    id: string;
    date: string;
    reference: string;
    warehouse: string;
    totalItem: number;
    status: "Draft" | "Approved";
    createdBy: string;
}

interface ReportStore {
    sales: any[];
    salesReturn: any[];
    purchases: any[];
    purchaseReturn: any[];
    stock: any[];
    stockTransfer: any[];
    cashTransfer: any[];
    profitLoss: any[];
    damages: any[];
    expenses: any[];
    deposits: any[];
    withdrawals: any[];
    transactions: any[];
    dailyBank: any[];
    totalBank: any[];
}
export const useGlobalReportStore = create<ReportStore>()(
    persist(
        (set) => ({
            // --- 1. SALES & PROFIT (From earlier) ---
            sales: [
                { id: "SR-1", date: "2026-11-05", invoiceNumber: "PS-003403", customer: "Kamrul Hasan", paymentMethod: "-", totalItem: 1, totalAmount: 3500, dueAmount: 3500, receivedAmount: 0, seller: "Md Heron Mia", status: "Due", createdBy: "Md Zihadul Islam" },
                { id: "SR-2", date: "2026-11-03", invoiceNumber: "PS-003394", customer: "Golam Mustarim", paymentMethod: "Cash", totalItem: 2, totalAmount: 2000, dueAmount: 0, receivedAmount: 2000, seller: "Md Heron Mia", status: "Paid", createdBy: "Md Zihadul Islam" },
            ],
            profitLoss: [
                { id: "PL-1", date: "2026-11-05", invoiceNumber: "PS-003403", product: "TOZO S7", seller: "Md Heron Mia", paymentMethod: "-", createdBy: "Md Zihadul", status: "Due", totalSale: 3500, totalPurchase: 2825, profitLoss: 675 },
                { id: "PL-2", date: "2026-11-05", invoiceNumber: "PS-003398", product: "Anker Zolo 20w", seller: "Jannat Ul Naeem", paymentMethod: "-", createdBy: "Md Zihadul", status: "Due", totalSale: 799, totalPurchase: 710, profitLoss: 89 },
            ],

            // --- 2. RETURNS[cite: 5, 7] ---
            salesReturn: [
                { id: "SRT-1", customer: "Kamrul Hasan", date: "2026-11-05", paymentMethod: "-", invoiceNumber: "SR-000309", totalItem: 1, totalAmount: 3500, dueAmount: 3500, receivedAmount: 0, seller: "Md Heron Mia", status: "Due" },
                { id: "SRT-2", customer: "Live Apple", date: "2026-11-05", paymentMethod: "-", invoiceNumber: "SR-000307", totalItem: 1, totalAmount: 1000, dueAmount: 1000, receivedAmount: 0, seller: "Md Zihadul Islam", status: "Due" }
            ],
            purchaseReturn: [
                { id: "PRT-1", supplier: "KiwtonMade", date: "2026-10-26", paymentMethod: "-", invoiceNumber: "PR-000111", totalItem: 1, totalAmount: 44000, dueAmount: 44000, receivedAmount: 0, status: "Due" },
                { id: "PRT-2", supplier: "Mobile House", date: "2026-10-20", paymentMethod: "-", invoiceNumber: "PR-000109", totalItem: 3, totalAmount: 50110, dueAmount: 50110, receivedAmount: 0, status: "Due" }
            ],

            // --- 3. PURCHASES[cite: 6] ---
            purchases: [
                { id: "PUR-1", supplier: "Ispot BD", date: "2026-11-03", paymentMethod: "-", invoiceNumber: "PP-001657", totalItem: 1, totalAmount: 24000, dueAmount: 24000, receivedAmount: 0, status: "Due" },
                { id: "PUR-2", supplier: "Afia Telecom", date: "2026-11-02", paymentMethod: "Brac Bank", invoiceNumber: "PP-001655", totalItem: 1, totalAmount: 36700, dueAmount: 0, receivedAmount: 36700, status: "Paid" }
            ],

            // --- 4. INVENTORY & STOCK[cite: 1, 8, 10] ---
            stock: [
                { id: "STK-1", product: "VOLTME Revo 20 Mini", brand: "VOLTME", category: "Wall Charger", purchaseDate: "2026-09-04", supplier: "Salamat Office", invoiceNumber: "PP-000735", serialNumber: "S/N:V2053...", quantity: 6, sale: 6, inStock: 0 },
                { id: "STK-2", product: "XIAOMI MIJIA Handheld", brand: "Xiaomi", category: "Steamer Iron", purchaseDate: "2026-07-23", supplier: "Power & Gear", invoiceNumber: "PP-001349", serialNumber: "50850/AV...", quantity: 6, sale: 2, inStock: 4 }
            ],
            stockTransfer: [
                { id: "STF-1", reference: "ST-000362", date: "2026-11-01", fromWarehouse: "TEKZO Online Shop", toWarehouse: "A-Block", totalItem: 1, status: "Approved", createdBy: "Md Zihadul Islam" },
                { id: "STF-2", reference: "ST-000361", date: "2026-11-01", fromWarehouse: "TEKZO Online Shop", toWarehouse: "A-Block", totalItem: 5, status: "Approved", createdBy: "Md Zihadul Islam" }
            ],
            damages: [
                { id: "DMG-1", date: "2026-10-29", reference: "DMG-000004", warehouse: "Salamat Innovation", totalItem: 1, status: "Draft", approvedBy: "-" },
                { id: "DMG-2", date: "2026-10-13", reference: "DMG-000002", warehouse: "A-Block", totalItem: 2, status: "Draft", approvedBy: "-" }
            ],

            // --- 5. FINANCIAL MOVEMENT[cite: 9, 11, 12, 13] ---
            cashTransfer: [
                { id: "CTF-1", reference: "CT-000061", date: "2026-11-01", fromWarehouse: "A-Block", toWarehouse: "TEKZO Online Shop", amount: 5970, status: "Approved" },
                { id: "CTF-2", reference: "CT-000059", date: "2026-10-25", fromWarehouse: "A-Block", toWarehouse: "TEKZO Online Shop", amount: 800, status: "Approved" }
            ],
            deposits: [
                { id: "DEP-1", date: "2026-11-02", invoiceNumber: "INV-295", title: "Payment from Atick Hasan", category: "Atick Hasan Sajib", party: "Afia Telecom", director: "Atick Hasan Sajib", depositAmount: 36700 },
                { id: "DEP-2", date: "2026-10-23", invoiceNumber: "INV-294", title: "Payment from Nadim Sarker", category: "Atick Hasan Sajib", party: "Nadim Sarker Rimon", director: "Atick Hasan Sajib", depositAmount: 50000 }
            ],
            withdrawals: [
                { id: "WTH-1", date: "2026-11-05", invoiceNumber: "WTH-907", title: "Sale income via Bkash", category: "Atick Hasan Sajib", party: "Nishimatsu Construction", director: "Atick Hasan Sajib", withdrawalAmount: 200 },
                { id: "WTH-2", date: "2026-11-03", invoiceNumber: "WTH-905", title: "Sale income via Bkash", category: "Atick Hasan Sajib", party: "MD Jishan", director: "Atick Hasan Sajib", withdrawalAmount: 2000 }
            ],
            transactions: [
                { id: "TRX-1", particular: "Payment Sent", invoiceNumber: "PP-3717", date: "2026-11-03", party: "Gadget Opia", paymentMethod: "Cash", total: 10000, debit: 0, credit: 10000, balance: -10000 },
                { id: "TRX-2", particular: "Sale", invoiceNumber: "PS-003403", date: "2026-11-05", party: "Kamrul Hasan", paymentMethod: "-", total: 3500, debit: 0, credit: 0, balance: -53000 }
            ],
            expenses: [
                { id: "EXP-1", date: "2026-11-04", reference: "EXP-1001", category: "Office Supplies", amount: 1500, status: "Approved" }
            ],
            dailyBank: [
                { id: "DB-1", date: "2026-11-06", bankName: "Brac Bank", accountNo: "1511223344", openingBalance: 50000, deposit: 10000, withdrawal: 2000, closingBalance: 58000 },
                { id: "DB-2", date: "2026-11-06", bankName: "City Bank", accountNo: "9988776655", openingBalance: 120000, deposit: 0, withdrawal: 15000, closingBalance: 105000 }
            ],
            totalBank: [
                { id: "TB-1", bankName: "Brac Bank", accountType: "Current", accountNo: "1511223344", branch: "Gulshan", currentBalance: 58000, status: "Active" },
                { id: "TB-2", bankName: "City Bank", accountType: "Savings", accountNo: "9988776655", branch: "Banani", currentBalance: 105000, status: "Active" }
            ],
        }),
        {
            name: "erp-reports-storage-v4" // Upgraded version to clear the empty cache
        }
    )
);
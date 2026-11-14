import { CashTransfer } from "@/types/cashTransfers";

// Moved from CashTransferClient / ViewCashTransferDrawer; amounts are now numbers.
const SAZZAD = "Md Zihadul Islam Sazzad";

export const INITIAL_CASH_TRANSFERS: CashTransfer[] = [
    { id: "056", ref: "CT-000056", fromShop: "A-Block", toShop: "TEKZO Online Shop", amount: 14500, date: "2026-10-08", createdAt: "2026-10-08T20:09:00+06:00", createdBy: SAZZAD, approvedBy: "Admin", note: "", status: "Approved" },
    { id: "055", ref: "CT-000055", fromShop: "A-Block", toShop: "TEKZO Online Shop", amount: 250, date: "2026-09-14", createdAt: "2026-09-14T19:08:00+06:00", createdBy: SAZZAD, approvedBy: "Admin", note: "", status: "Approved" },
    { id: "054", ref: "CT-000054", fromShop: "A-Block", toShop: "TEKZO Online Shop", amount: 1650, date: "2026-09-14", createdAt: "2026-09-14T18:56:00+06:00", createdBy: SAZZAD, approvedBy: "Admin", note: "", status: "Approved" },
    { id: "053", ref: "CT-000053", fromShop: "A-Block", toShop: "TEKZO Online Shop", amount: 5300, date: "2026-09-12", createdAt: "2026-09-12T19:38:00+06:00", createdBy: SAZZAD, approvedBy: "Admin", note: "", status: "Approved" },
    { id: "052", ref: "CT-000052", fromShop: "A-Block", toShop: "TEKZO JFP 4C-021C1", amount: 20000, date: "2026-09-11", createdAt: "2026-09-11T18:29:00+06:00", createdBy: SAZZAD, approvedBy: "Admin", note: "", status: "Approved" },
];

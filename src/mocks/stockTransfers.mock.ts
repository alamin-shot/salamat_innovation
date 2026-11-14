import { StockTransfer } from "@/types/stockTransfers";

// Moved from StockTransferClient / ViewStockTransferDrawer. Item counts match the old table (2,1,1,1,1).
const SAZZAD = "Md Zihadul Islam Sazzad";

export const INITIAL_STOCK_TRANSFERS: StockTransfer[] = [
    {
        id: "353", ref: "ST-000353", fromShop: "TEKZO JFP 4A-018A", toShop: "A-Block", date: "2026-10-08",
        createdAt: "2026-10-08T19:34:00+06:00", createdBy: SAZZAD, approvedBy: SAZZAD, note: "", status: "Approved",
        serials: [
            { id: "st353-1", serialNo: "0000027808", product: "VOLTME Revo 30 Mini2", sku: "V2259", variant: "White" },
            { id: "st353-2", serialNo: "0000027697", product: "VOLTME Revo 30 Mini2", sku: "V2259", variant: "White" },
        ],
    },
    {
        id: "352", ref: "ST-000352", fromShop: "TEKZO Online Shop", toShop: "A-Block", date: "2026-10-08",
        createdAt: "2026-10-08T18:52:00+06:00", createdBy: SAZZAD, approvedBy: SAZZAD, note: "", status: "Approved",
        serials: [{ id: "st352-1", serialNo: "S/N:V212710D480008E", product: "VOLTME Revo 35 Duo CC", sku: "V2271", variant: "Black" }],
    },
    {
        id: "351", ref: "ST-000351", fromShop: "Salamat Innovation", toShop: "A-Block", date: "2026-10-06",
        createdAt: "2026-10-06T16:33:00+06:00", createdBy: SAZZAD, approvedBy: SAZZAD, note: "", status: "Approved",
        serials: [{ id: "st351-1", serialNo: "0000027541", product: "VOLTME Revo 30 Mini2", sku: "V2259", variant: "Black" }],
    },
    {
        id: "349", ref: "ST-000349", fromShop: "A-Block", toShop: "TEKZO Online Shop", date: "2026-10-01",
        createdAt: "2026-10-01T14:42:00+06:00", createdBy: SAZZAD, approvedBy: SAZZAD, note: "", status: "Cancelled",
        serials: [{ id: "st349-1", serialNo: "0000026990", product: "VOLTME Revo 30 Mini2", sku: "V2259", variant: "White" }],
    },
    {
        id: "348", ref: "ST-000348", fromShop: "A-Block", toShop: "TEKZO Online Shop", date: "2026-10-01",
        createdAt: "2026-10-01T14:38:00+06:00", createdBy: SAZZAD, approvedBy: SAZZAD, note: "", status: "Cancelled",
        serials: [{ id: "st348-1", serialNo: "0000026985", product: "VOLTME Revo 30 Mini2", sku: "V2259", variant: "White" }],
    },
];

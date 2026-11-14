import { Sale, SaleLineItem, SaleReturn } from "@/types/sales";

// Moved from SalesClient / SaleReturnClient (amounts match the old rows) plus the three sales the
// Barcodes module records as Sold (INV-…), so a sold serial always traces back to a sale.
// Customers link to People (ids 1, 25–32). Barcode-recorded sales are assumed paid in full.
const SAZZAD = "Md Zihadul Islam Sazzad";

const item = (id: string, productName: string, variant: string, sku: string, serial: string, purchasePrice: number, mrp: number, salePrice: number, barcodeId: string | null = null): SaleLineItem =>
    ({ id, barcodeId, productName, variant, sku, serial, purchasePrice, mrp, salePrice, quantity: 1 });

const cable = (n: number, salePrice: number) => item(`s3268-${n}`, "VOLTME PowerLink RUGG C to C", "Black/1.8M/ 3A/ 60W", "V-PL-RUGG-CC", `00004429${String(15 + n).padStart(2, "0")}`, 263, 1200, salePrice);

export const INITIAL_SALES: Sale[] = [
    {
        id: "3268", invoiceNumber: "PS-003268", customerId: "25", customerName: "Md Shakhiur Rahman Tamal", date: "2026-10-12", seller: "AV",
        address: "Pakutia zamidar bari, Nagarpur, Tangail, 1936",
        items: [cable(1, 350), cable(2, 320), cable(3, 320), cable(4, 320), cable(5, 320)],
        orderTaxPct: 0, shippingCost: 120, additionalChargeName: "", additionalChargeAmount: 0, courier: "Pending", createdAt: "2026-10-12T15:10:00+06:00", createdBy: SAZZAD,
    },
    {
        id: "3267", invoiceNumber: "PS-003267", customerId: "26", customerName: "Mainul Hasan Mahin", date: "2026-10-12", seller: SAZZAD, address: "-",
        items: [item("s3267-1", "iPhone 15 Pro", "White / 256GB", "IP15P-256-WHT", "353210114599901", 70000, 78000, 75000)],
        orderTaxPct: 0, shippingCost: 0, additionalChargeName: "", additionalChargeAmount: 0, courier: "—", createdAt: "2026-10-12T12:40:00+06:00", createdBy: SAZZAD,
    },
    {
        id: "3260", invoiceNumber: "PS-003260", customerId: "27", customerName: "SUFINEWAJ RAYHAN", date: "2026-10-10", seller: "AV", address: "-",
        items: [item("s3260-1", "Galaxy A16", "Black / 4GB/128GB", "GA16-128-BLK", "350187220093399", 12000, 14500, 13480)],
        orderTaxPct: 0, shippingCost: 120, additionalChargeName: "", additionalChargeAmount: 0, courier: "—", createdAt: "2026-10-10T17:05:00+06:00", createdBy: SAZZAD,
    },
    {
        id: "inv-1187", invoiceNumber: "INV-2026-1187", customerId: "1", customerName: "Yasin", date: "2026-10-15", seller: SAZZAD, address: "-",
        items: [item("s1187-1", "iPhone 13 Pro", "128GB/Sierra Blue", "IP13P-128-SB", "353100552915705", 51000, 53990, 53990, "bc-04")],
        orderTaxPct: 0, shippingCost: 0, additionalChargeName: "", additionalChargeAmount: 0, courier: "—", createdAt: "2026-10-15T19:25:00+06:00", createdBy: SAZZAD,
    },
    {
        id: "inv-1122", invoiceNumber: "INV-2026-1122", customerId: "29", customerName: "Ratul Shikder", date: "2026-10-04", seller: SAZZAD, address: "-",
        items: [item("s1122-1", "Nothing Phone 4a", "White/8GB/128GB", "NP4A-128-WHT", "357054044466206", 47400, 48500, 48500, "bc-01")],
        orderTaxPct: 0, shippingCost: 0, additionalChargeName: "", additionalChargeAmount: 0, courier: "—", createdAt: "2026-10-04T15:45:19+06:00", createdBy: SAZZAD,
    },
    {
        id: "inv-1121", invoiceNumber: "INV-2026-1121", customerId: "28", customerName: "Mintu Talukder", date: "2026-10-04", seller: SAZZAD, address: "-",
        items: [item("s1121-1", "Redmi 15", "Midnight Black/8GB/256GB", "RDM15-256-MB", "865013000353040", 23500, 25500, 25500, "bc-02")],
        orderTaxPct: 0, shippingCost: 0, additionalChargeName: "", additionalChargeAmount: 0, courier: "—", createdAt: "2026-10-04T14:40:13+06:00", createdBy: SAZZAD,
    },
];

// Legacy returns: recorded before sales were stored, so their items have no saleId.
export const INITIAL_SALE_RETURNS: SaleReturn[] = [
    {
        id: "293", returnNumber: "SR-000293", customerId: "30", customerName: "MD MINHAZUL ISLAM RIFAT", date: "2026-10-10",
        items: [
            { id: "r293-1", saleId: null, saleInvoice: null, barcodeId: null, productName: "QCY Type C-L 27W Charging Cable", variant: "Black", sku: "SI-588128987", serial: "4516192621", unitPrice: 550, refundAmount: 500 },
            { id: "r293-2", saleId: null, saleInvoice: null, barcodeId: null, productName: "QCY Type C-L 27W Charging Cable", variant: "Black", sku: "SI-588128987", serial: "7627187010", unitPrice: 550, refundAmount: 500 },
        ],
        discount: 0, orderTaxPct: 0, shippingCost: 0, createdAt: "2026-10-10T16:00:00+06:00", createdBy: SAZZAD,
    },
    {
        id: "289", returnNumber: "SR-000289", customerId: "31", customerName: "Jihad", date: "2026-09-28",
        items: [{ id: "r289-1", saleId: null, saleInvoice: null, barcodeId: null, productName: "VOLTME Revo 20 Mini", variant: "White", sku: "V2053", serial: "S/N:V2053A0019", unitPrice: 999, refundAmount: 999 }],
        discount: 0, orderTaxPct: 0, shippingCost: 0, createdAt: "2026-09-28T13:00:00+06:00", createdBy: SAZZAD,
    },
    {
        id: "285", returnNumber: "SR-000285", customerId: "32", customerName: "Daraz", date: "2026-09-27",
        items: [{ id: "r285-1", saleId: null, saleInvoice: null, barcodeId: null, productName: "Kieslect Health Tracker", variant: "Black", sku: "KSL-HT-BLK", serial: "K403H7AN30011", unitPrice: 2565, refundAmount: 2565 }],
        discount: 0, orderTaxPct: 0, shippingCost: 0, createdAt: "2026-09-27T12:00:00+06:00", createdBy: SAZZAD,
    },
];

import { Purchase, PurchaseLineItem, PurchaseReturn } from "@/types/purchases";
import { EMPTY_PURCHASE_COSTING } from "@/constants/purchases";

// Moved from usePurchasesManager / PurchaseReturnTable / the drawers' hard-coded markup.
// Totals and item counts equal what those screens showed; they are now computed from the line items.

const SAZZAD = "Md Zihadul Islam Sazzad";

interface LineSeed {
    productName: string;
    variant: string;
    sku: string;
    /** First serial; following rows count up from it. */
    serialStart: string;
}

/** One row per unit (quantity 1), one price per row. */
function lines(prefix: string, seed: LineSeed, prices: number[]): PurchaseLineItem[] {
    return prices.map((unitPrice, index) => ({
        id: `${prefix}-${index + 1}`,
        barcodeId: null,
        productName: seed.productName,
        variant: seed.variant,
        sku: seed.sku,
        serial: (BigInt(seed.serialStart) + BigInt(index)).toString(),
        unitPrice,
        quantity: 1,
    }));
}

/** "Paid" seeds have matching Payment records in payments.mock (PAY-3600…3603, and PP-3594 for PP-001601). */
export const INITIAL_PURCHASES: Purchase[] = [
    {
        id: "1", invoiceNumber: "PP-001603", supplierId: "15", supplier: "Rasel Raj", supplierInitials: "RR", badgeColor: "bg-emerald-600",
        location: "Warehouse A", date: "2026-10-11", status: "Paid", createdBy: SAZZAD, costing: EMPTY_PURCHASE_COSTING,
        items: lines("pl-1", { productName: "Galaxy S25 Ultra", variant: "Titanium Black / 12GB/512GB", sku: "SI-582140117", serialStart: "356899255860459" }, [82000]),
    },
    {
        id: "2", invoiceNumber: "PP-001602", supplierId: "16", supplier: "Bina Ambix", supplierInitials: "B", badgeColor: "bg-emerald-700",
        location: "Warehouse A", date: "2026-10-10", status: "Paid", createdBy: SAZZAD, costing: EMPTY_PURCHASE_COSTING,
        items: lines("pl-2", { productName: "iPhone 15 Pro", variant: "White / 256GB", sku: "SI-582140245", serialStart: "353210114562781" }, [60000]),
    },
    {
        id: "3", invoiceNumber: "PP-001601", supplierId: "17", supplier: "Gadget Opia", supplierInitials: "GO", badgeColor: "bg-gray-900",
        location: "Warehouse A", date: "2026-10-10", status: "Paid", createdBy: SAZZAD, costing: EMPTY_PURCHASE_COSTING,
        items: lines("pl-3", { productName: "Nothing Phone 4a", variant: "White / 8GB/128GB", sku: "SI-582140390", serialStart: "359882710045126" }, [13000]),
    },
    {
        id: "4", invoiceNumber: "PP-001599", supplierId: "18", supplier: "huge Collection", supplierInitials: "HC", badgeColor: "bg-emerald-500",
        location: "Warehouse A", date: "2026-10-09", status: "Paid", createdBy: SAZZAD, costing: EMPTY_PURCHASE_COSTING,
        items: lines("pl-4", { productName: "iPhone 15 Pro", variant: "Titanium Black / 128GB", sku: "SI-582140412", serialStart: "353210114598830" }, [47400]),
    },
    {
        id: "5", invoiceNumber: "PP-001598", supplierId: "19", supplier: "Cell Tech BD", supplierInitials: "CB", badgeColor: "bg-emerald-600",
        location: "Warehouse A", date: "2026-10-09", status: "Paid", createdBy: SAZZAD, costing: EMPTY_PURCHASE_COSTING,
        items: lines("pl-5", { productName: "Galaxy S25 Ultra", variant: "White / 12GB/256GB", sku: "SI-582140533", serialStart: "356899255871204" }, [23000]),
    },
];


const OPPO_A6X: LineSeed = { productName: "Oppo A6x", variant: "4GB/64GB/Plum Purple", sku: "SI-546447530", serialStart: "862672084151797" };

export const INITIAL_PURCHASE_RETURNS: PurchaseReturn[] = [
    {
        id: "108", invoiceNumber: "PR-000107", supplierId: "20", supplier: "World Trade Center", company: "World Trade Center", supplierInitials: "WC", badgeColor: "bg-emerald-700",
        date: "2026-10-08", dueAmount: 113840, createdBy: SAZZAD, costing: EMPTY_PURCHASE_COSTING,
        items: lines("rl-108", OPPO_A6X, [18990, 18990, 37930, 37930]),
    },
    {
        // Shown as ৳0.00 total and ৳0.00 due before; kept as-is, so this return is settled (edit locked).
        id: "107", invoiceNumber: "PR-000106", supplierId: "21", supplier: "Xeero Sojib", company: "Sojib", supplierInitials: "X", badgeColor: "bg-emerald-600",
        date: "2026-10-04", dueAmount: 0, createdBy: SAZZAD, costing: EMPTY_PURCHASE_COSTING,
        items: lines("rl-107", { productName: "Galaxy A16", variant: "Black / 4GB/128GB", sku: "SI-546447611", serialStart: "350187220093314" }, [0, 0, 0, 0, 0, 0]),
    },
    {
        id: "106", invoiceNumber: "PR-000105", supplierId: "22", supplier: "Gadget Home", company: "Gadget Home", supplierInitials: "GH", badgeColor: "bg-teal-700",
        date: "2026-09-14", dueAmount: 898000, createdBy: SAZZAD, costing: EMPTY_PURCHASE_COSTING,
        items: lines("rl-106", { productName: "iPhone 15 Pro", variant: "Titanium Black / 256GB", sku: "SI-546447702", serialStart: "353210114610050" },
            [64000, 64000, 64000, 64000, 64000, 64000, 64000, 64000, 64000, 64000, 64000, 64000, 65000, 65000]),
    },
];

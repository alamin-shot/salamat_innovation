export type CourierColumnKey =
    | "date" | "provider" | "invoiceNumber" | "trackingId" | "consignmentId"
    | "store" | "recipient" | "address" | "itemType" | "deliveryType" | "deliveryArea"
    | "amountToCollect" | "codAmount" | "discount" | "weightKg" | "exchange"
    | "status" | "paymentStatus" | "createdBy";

export interface CourierPageConfig {
    title: string;
    targetProvider: "All" | "Pathao" | "Steadfast" | "REDX";
    emptyStateMessage: string;
    columns: CourierColumnKey[];
    topAction?: {
        label: string;
        colorClass: string;
        drawerToOpen: "sync-pathao" | "import-excel";
    };
    showTotals?: boolean;
}

export const ALL_COURIERS_CONFIG: CourierPageConfig = {
    title: "All Courier Orders",
    targetProvider: "All",
    emptyStateMessage: "No courier orders found.",
    showTotals: true,
    columns: [
        "date", "provider", "invoiceNumber", "trackingId", "store",
        "recipient", "address", "amountToCollect", "discount", "status", "createdBy"
    ]
};

export const PATHAO_CONFIG: CourierPageConfig = {
    title: "Pathao Orders",
    targetProvider: "Pathao",
    emptyStateMessage: "No Pathao orders found.",
    topAction: {
        label: "Sync from Pathao",
        colorClass: "bg-emerald-600 text-white hover:bg-emerald-700",
        drawerToOpen: "sync-pathao"
    },
    columns: [
        "date", "invoiceNumber", "consignmentId", "store", "recipient",
        "address", "itemType", "deliveryType", "amountToCollect",
        "discount", "status", "paymentStatus", "createdBy"
    ]
};

export const STEADFAST_CONFIG: CourierPageConfig = {
    title: "Steadfast Orders",
    targetProvider: "Steadfast",
    emptyStateMessage: "No Steadfast orders found.",
    topAction: {
        label: "Import from Excel",
        colorClass: "bg-emerald-600 text-white hover:bg-emerald-700",
        drawerToOpen: "import-excel"
    },
    columns: [
        "date", "invoiceNumber", "consignmentId", "trackingId", "recipient",
        "address", "codAmount", "deliveryType", "weightKg", "exchange",
        "status", "paymentStatus", "createdBy"
    ]
};

export const REDX_CONFIG: CourierPageConfig = {
    title: "REDX Orders",
    targetProvider: "REDX",
    emptyStateMessage: "Nothing to show here",
    columns: [
        "date", "invoiceNumber", "trackingId", "recipient", "address",
        "deliveryArea", "codAmount", "weightKg", "status", "createdBy"
    ]
};
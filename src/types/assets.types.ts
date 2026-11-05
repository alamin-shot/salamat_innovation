export type AssetStatus = "Available" | "Assigned" | "Under Maintenance" | "Retired";

export interface AssetCategory {
    id: string;
    name: string;
    prefix: string;
    defaultLifespanMonths: number;
    defaultDepreciationRate: number;
    status: "Active" | "Inactive";
}

export interface AssetLedgerLog {
    id: string;
    assetId: string;
    action: "Purchased" | "Assigned" | "Returned" | "Repaired" | "Retired";
    timestamp: string;
    employeeId?: string;
    employeeName?: string;
    cost?: number;
    note: string;
}

export interface Asset {
    id: string;
    categoryId: string;
    assetCode: string;
    name: string;
    status: AssetStatus;
    serialNumber: string;
    purchaseDate: string;
    purchaseCost: number;
    currentDepreciatedValue: number;
    warrantyExpiry: string;
    assignedToId?: string;
    assignedToName?: string;
    location: string;
    note: string;
    _version: number;
}
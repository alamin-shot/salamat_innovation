// LAYER 1: Sell Device Requests (customers offering a used device; future /api/sell-device-requests).

export type SellDeviceStatus = "Pending" | "Contacted" | "Approved" | "Rejected";

export interface SellDeviceRequest {
    id: string;
    requestId: string;
    customerName: string;
    phone: string;
    deviceBrand: string;
    deviceModel: string;
    ramStorage: string;
    condition: string;
    expectedPrice: number;
    adminNote: string | null;
    status: SellDeviceStatus;
    /** Condition photos sent with the request (image URLs). Empty until the storefront sends them. */
    photos: string[];
    /** ISO-8601 */
    createdAt: string;
}

export interface SellDeviceState {
    requests: SellDeviceRequest[];
    addRequest: (request: Omit<SellDeviceRequest, "id" | "requestId" | "createdAt">) => void;
    updateRequest: (id: string, updatedData: Partial<SellDeviceRequest>) => void;
    deleteRequest: (id: string) => void;
    bulkDeleteRequests: (ids: string[]) => void;
    updateStatus: (id: string, status: SellDeviceStatus) => void;
}

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CourierProvider = "Pathao" | "Steadfast" | "REDX";

export interface CourierShipment {
    id: string;
    date: string;
    provider: CourierProvider;
    invoiceNumber: string;
    trackingId: string;
    store: string;
    recipientName: string;
    recipientPhone: string;
    address: string;
    itemType?: string;
    deliveryType?: string;
    amountToCollect: number;
    codAmount?: number;
    discount: number;
    weightKg?: number;
    exchange?: string;
    status: string;
    paymentStatus?: string;
    createdBy: string;
}

interface CourierStore {
    shipments: CourierShipment[];
    syncPathao: (storeName: string) => void;
    importExcel: (fileData: any) => void;
}

const dummyShipments: CourierShipment[] = [
    {
        id: "1", date: "2026-10-25 11:20 AM", provider: "Pathao", invoiceNumber: "-", trackingId: "DS261026FL6F2J",
        store: "TEKZO Online Shop", recipientName: "Nazim Nazmul", recipientPhone: "01717118116",
        address: "Ocean Electrical Ltd, Charpatharghata, Chattogram", itemType: "Parcel", deliveryType: "Normal",
        amountToCollect: 1150.00, discount: 0, status: "In Transit", createdBy: "Jannat Ul Naeem Sarah"
    },
    {
        id: "2", date: "2026-10-25 08:53 AM", provider: "Steadfast", invoiceNumber: "PS-003333", trackingId: "312637778",
        store: "TEKZO", recipientName: "shahriar arifin", recipientPhone: "01715508670",
        address: "Kanipur kb brick, Faridpur Sadar", deliveryType: "Home Delivery", weightKg: 0.00,
        amountToCollect: 2370.00, discount: 0, status: "Delivered", createdBy: "Md Zihadul Islam Sazzad"
    }
];

export const useCourierStore = create<CourierStore>()(
    persist(
        (set) => ({
            shipments: dummyShipments,
            syncPathao: (storeName) => {
                // Future API logic here
                console.log("Syncing Pathao for", storeName);
            },
            importExcel: (fileData) => {
                // Future Excel parser logic here
                console.log("Importing Excel", fileData);
            }
        }),
        { name: "erp-courier-storage-v1" }
    )
);
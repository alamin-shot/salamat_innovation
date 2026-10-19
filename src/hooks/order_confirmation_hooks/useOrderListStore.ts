import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface OrderItem {
    id: string;
    customer: string;
    customerPhone: string;
    date: string;
    confirmationDate: string;
    product: string;
    address: string;
    orderMedia: "WhatsApp" | "Messenger" | "Phone Call" | "-";
    onlineOffline: "Online" | "Offline";
    orderPerson: string;
    advanceMedia: string;
    advanceAmount: number;
    sellingPrice: number;
    cod: number;
    note: string;
    deliveryStatus: string;
    invoiceNo: string;
    deliveryBy: string;
    track: string;
}

interface OrderListState {
    orders: OrderItem[];
    addOrder: (order: Omit<OrderItem, "id">) => void;
    updateOrder: (id: string, updated: Partial<OrderItem>) => void;
    deleteOrder: (id: string) => void;
    bulkDeleteOrders: (ids: string[]) => void;
    updateDeliveryStatus: (id: string, status: string) => void;
}

export const useOrderListStore = create<OrderListState>()(
    persist(
        (set) => ({
            orders: [
                {
                    id: "1",
                    customer: "Pronoy Roy",
                    customerPhone: "01715232149",
                    date: "18 Oct 2026",
                    confirmationDate: "18 Oct 2026",
                    product: "Haylou Solar 5",
                    address: "Bochagonj,Dinajpur",
                    orderMedia: "WhatsApp",
                    onlineOffline: "Offline",
                    orderPerson: "Jannat Ull Naeem Sarah",
                    advanceMedia: "Bkash 22",
                    advanceAmount: 120.0,
                    sellingPrice: 6449.0,
                    cod: 6449.0,
                    note: "-",
                    deliveryStatus: "-",
                    invoiceNo: "-",
                    deliveryBy: "-",
                    track: "-",
                },
                {
                    id: "2",
                    customer: "ARIFUL ISLAM",
                    customerPhone: "01887476986",
                    date: "18 Oct 2026",
                    confirmationDate: "18 Oct 2026",
                    product: "Galaxy F36 5G",
                    address: "-",
                    orderMedia: "WhatsApp",
                    onlineOffline: "Offline",
                    orderPerson: "Jannat Ull Naeem Sarah",
                    advanceMedia: "Bkash 22",
                    advanceAmount: 3000.0,
                    sellingPrice: 28800.0,
                    cod: 26308.0,
                    note: "-",
                    deliveryStatus: "-",
                    invoiceNo: "-",
                    deliveryBy: "-",
                    track: "-",
                },
                {
                    id: "3",
                    customer: "Tech Nest",
                    customerPhone: "01618461190",
                    date: "18 Oct 2026",
                    confirmationDate: "18 Oct 2026",
                    product: "VOLTME Revo 20 Mini Bundle IRex Cable CTL",
                    address: "-",
                    orderMedia: "-",
                    onlineOffline: "Offline",
                    orderPerson: "-",
                    advanceMedia: "-",
                    advanceAmount: 0.0,
                    sellingPrice: 0.0,
                    cod: 0.0,
                    note: "Warranty Product",
                    deliveryStatus: "-",
                    invoiceNo: "-",
                    deliveryBy: "-",
                    track: "-",
                },
                {
                    id: "4",
                    customer: "Mosharraf hosen Bhuiyan",
                    customerPhone: "01712394781",
                    date: "15 Oct 2026",
                    confirmationDate: "15 Oct 2026",
                    product: "TOZO S7",
                    address: "-",
                    orderMedia: "WhatsApp",
                    onlineOffline: "Online",
                    orderPerson: "Jannat Ull Naeem Sarah",
                    advanceMedia: "-",
                    advanceAmount: 0.0,
                    sellingPrice: 3500.0,
                    cod: 3620.0,
                    note: "-",
                    deliveryStatus: "-",
                    invoiceNo: "-",
                    deliveryBy: "-",
                    track: "-",
                },
            ],
            addOrder: (newOrder) =>
                set((state) => ({
                    orders: [{ ...newOrder, id: crypto.randomUUID() }, ...state.orders],
                })),
            updateOrder: (id, updated) =>
                set((state) => ({
                    orders: state.orders.map((item) =>
                        item.id === id ? { ...item, ...updated } : item
                    ),
                })),
            deleteOrder: (id) =>
                set((state) => ({
                    orders: state.orders.filter((item) => item.id !== id),
                })),
            bulkDeleteOrders: (ids) =>
                set((state) => ({
                    orders: state.orders.filter((item) => !ids.includes(item.id)),
                })),
            updateDeliveryStatus: (id, status) =>
                set((state) => ({
                    orders: state.orders.map((item) =>
                        item.id === id ? { ...item, deliveryStatus: status } : item
                    ),
                })),
        }),
        {
            name: "tekzo_order_list_store",
        }
    )
);
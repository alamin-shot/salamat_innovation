import { create } from "zustand";
import { persist } from "zustand/middleware";

export type OrderStatus = "Pending" | "Confirmed" | "Approved" | "Processing" | "Onway" | "Complete" | "Rejected";
export type PaymentStatus = "Pending" | "Partial" | "Paid";

export interface OrderItem {
    id: string;
    sku: string;
    name: string;
    variant: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    lineTotal: number;
}

export interface CourierStat {
    name: string;
    success: number;
    cancelled: number;
}

export interface FraudMetrics {
    genuineProbability: number;
    fraudProbability: number;
    couriers: CourierStat[];
}

export interface OrderRecord {
    id: string;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    customerAddress?: string;
    date: string;
    warehouse: string;
    pm: "cod" | "online" | "bkash";
    billAmount: number;
    grandTotal: number;
    payableAmount: number;
    dueAmount: number;
    status: OrderStatus;
    pStatus: PaymentStatus;
    cNote: string;
    fraudMetrics: FraudMetrics;
    items: OrderItem[];
}

interface OrderStore {
    orders: OrderRecord[];
    updateOrderStatus: (id: string, status: OrderStatus) => void;
    updatePaymentStatus: (id: string, status: PaymentStatus) => void;
    receivePayment: (id: string, amount: number) => void;
    updateOrderItem: (orderId: string, itemId: string, updates: Partial<OrderItem>) => void;
    bulkDeleteOrders: (ids: string[]) => void;
}

// 1. DUMMY DATA (Derived exactly from your screenshots)
const initialDummyOrders: OrderRecord[] = [
    {
        id: "1799",
        orderNumber: "ORD-20261025-001799",
        customerName: "Nazmul Akbar Jewel",
        customerPhone: "01711227290",
        customerEmail: "jraria10@gmail.com",
        customerAddress: "House 33, Road 02, Block E, Banasree, Rampura, Dhaka, 1219",
        date: "26 Oct 2026 10:28 PM",
        warehouse: "TEKZO",
        pm: "cod",
        billAmount: 3200.00,
        grandTotal: 2370.00,
        payableAmount: 0.00,
        dueAmount: 2370.00,
        status: "Pending",
        pStatus: "Pending",
        cNote: "Check Fraud",
        fraudMetrics: {
            genuineProbability: 97.59,
            fraudProbability: 2.00,
            couriers: [
                { name: "Pathao", success: 87, cancelled: 2 },
                { name: "SteadFast", success: 0, cancelled: 0 },
                { name: "RedX", success: 0, cancelled: 0 },
            ]
        },
        items: [
            { id: "item_1", sku: "F4025", name: "VOLTME VITO Go 35W EzTravel", variant: "Black", quantity: 1, unitPrice: 3200.00, discount: 900.00, lineTotal: 2300.00 }
        ]
    },
    {
        id: "1798",
        orderNumber: "ORD-20261025-001798",
        customerName: "MD TAMIM IQBAL REZA",
        customerPhone: "01815413494",
        date: "26 Oct 2026 09:30 PM",
        warehouse: "TEKZO",
        pm: "online",
        billAmount: 1450.00,
        grandTotal: 6250.00,
        payableAmount: 5000.00,
        dueAmount: 5460.00,
        status: "Confirmed",
        pStatus: "Partial",
        cNote: "BD Courier",
        fraudMetrics: {
            genuineProbability: 96.18,
            fraudProbability: 3.00,
            couriers: [
                { name: "RedX", success: 20, cancelled: 4 },
                { name: "Pathao", success: 81, cancelled: 2 },
            ]
        },
        items: []
    }
];

export const useOrderStore = create<OrderStore>()(
    persist(
        (set) => ({
            orders: initialDummyOrders,

            updateOrderStatus: (id, status) => set((state) => ({
                orders: state.orders.map(order => order.id === id ? { ...order, status } : order)
            })),

            updatePaymentStatus: (id, pStatus) => set((state) => ({
                orders: state.orders.map(order => order.id === id ? { ...order, pStatus } : order)
            })),

            receivePayment: (id, amount) => set((state) => ({
                orders: state.orders.map(order => {
                    if (order.id !== id) return order;
                    const newDue = Math.max(0, order.dueAmount - amount);
                    const newPayable = order.payableAmount + amount;
                    const newStatus = newDue === 0 ? "Paid" : "Partial";
                    return { ...order, dueAmount: newDue, payableAmount: newPayable, pStatus: newStatus };
                })
            })),

            updateOrderItem: (orderId, itemId, updates) => set((state) => ({
                orders: state.orders.map(order => {
                    if (order.id !== orderId) return order;
                    const newItems = order.items.map(item => {
                        if (item.id !== itemId) return item;
                        const qty = updates.quantity ?? item.quantity;
                        const price = updates.unitPrice ?? item.unitPrice;
                        const disc = updates.discount ?? item.discount;
                        return { ...item, ...updates, lineTotal: (qty * price) - disc };
                    });
                    return { ...order, items: newItems };
                })
            })),

            bulkDeleteOrders: (ids) => set((state) => ({
                orders: state.orders.filter(order => !ids.includes(order.id))
            }))
        }),
        // CACHE BUST KEY: Must be new so the browser loads our dummy data!
        { name: "erp-orders-storage-v1" }
    )
);
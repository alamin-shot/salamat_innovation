import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    GeneralConfig, HRConfig, SecurityConfig, NotificationConfig,
    ShopRecord, EcommerceRecord, PaymentMethodRecord, AreaShippingRecord
} from "@/types/settings";

interface GlobalSettingsState {
    generalConfig: GeneralConfig;
    updateGeneralConfig: (config: Partial<GeneralConfig>) => void;

    hrConfig: HRConfig;
    updateHRConfig: (config: Partial<HRConfig>) => void;

    securityConfig: SecurityConfig;
    updateSecurityConfig: (config: Partial<SecurityConfig>) => void;

    notificationConfig: NotificationConfig;
    updateNotificationConfig: (config: Partial<NotificationConfig>) => void;

    deliveryInsideDhaka: number;
    deliveryOutsideDhaka: number;
    updateDeliveryCharges: (inside: number, outside: number) => void;

    shops: ShopRecord[];
    addShop: (shop: Omit<ShopRecord, "id" | "createdAt">) => void;
    updateShop: (id: string, updates: Partial<ShopRecord>) => void;
    deleteShops: (ids: string[]) => void;

    ecommerce: EcommerceRecord[];
    addEcommerce: (platform: Omit<EcommerceRecord, "id" | "createdAt">) => void;
    updateEcommerce: (id: string, updates: Partial<EcommerceRecord>) => void;
    deleteEcommerce: (ids: string[]) => void;

    paymentMethods: PaymentMethodRecord[];
    addPaymentMethod: (pm: Omit<PaymentMethodRecord, "id">) => void;
    updatePaymentMethod: (id: string, updates: Partial<PaymentMethodRecord>) => void;
    deletePaymentMethods: (ids: string[]) => void;

    areaShipping: AreaShippingRecord[];
    updateAreaShipping: (id: string, updates: Partial<AreaShippingRecord>) => void;
}

export const useGlobalSettingsStore = create<GlobalSettingsState>()(
    persist(
        (set) => ({
            generalConfig: {
                companyName: "Business Suite Salamat Innovation",
                address: "Dhaka Bangladesh",
                phone: "+8801897715220",
                email: "info@salamatinnovation.com",
                website: "https://salamatinnovation.com/",
                currency: "BDT",
                dateFormat: "DD-MM-YYYY",
                decimalSeparator: "dot",
                thousandSeparator: "comma",
                currencyPosition: "left_space",
                taxRate: 15,
                taxNumber: "",
                brandColor: "#0caa8d",
                maintenanceMode: false,
                logoUrl: null, iconUrl: null, bannerUrl: null,
            },

            hrConfig: {
                payrunPeriod: "Monthly",
                payrunGeneratingType: "Hour",
                considerOvertime: false,
                leaveStartMonth: "September",
                paidLeaveEligibility: ["Probation", "Permanent"],
                unpaidLeaveEligibility: ["Probation", "Permanent"],
                punchToleranceMinutes: 10,
                workAvailabilityPercent: 90,
                selectedGeoProvider: "google",
                apiKeyGoogle: "", apiKeyMapbox: "", apiKeyIp: "",
            },

            securityConfig: {
                global2FAEnforced: false,
                sessionTimeoutMinutes: 120,
            },

            notificationConfig: {
                emailGatewayKey: "",
                smsGatewayKey: "",
                notifyOnShopCreate: true,
                notifyOnPayrun: true,
            },

            deliveryInsideDhaka: 70,
            deliveryOutsideDhaka: 120,

            shops: [],
            ecommerce: [],
            paymentMethods: [],
            areaShipping: [],

            updateGeneralConfig: (updates) => set((state) => ({ generalConfig: { ...state.generalConfig, ...updates } })),
            updateHRConfig: (updates) => set((state) => ({ hrConfig: { ...state.hrConfig, ...updates } })),
            updateSecurityConfig: (updates) => set((state) => ({ securityConfig: { ...state.securityConfig, ...updates } })),
            updateNotificationConfig: (updates) => set((state) => ({ notificationConfig: { ...state.notificationConfig, ...updates } })),
            updateDeliveryCharges: (inside, outside) => set(() => ({ deliveryInsideDhaka: inside, deliveryOutsideDhaka: outside })),

            addShop: (shop) => set((state) => ({ shops: [{ ...shop, id: `S-${Date.now()}`, createdAt: new Date().toLocaleDateString('en-GB').replace(/\//g, '-') }, ...state.shops] })),
            updateShop: (id, updates) => set((state) => ({ shops: state.shops.map(s => s.id === id ? { ...s, ...updates } : s) })),
            deleteShops: (ids) => set((state) => ({ shops: state.shops.filter(s => !ids.includes(s.id)) })),

            addEcommerce: (platform) => set((state) => ({ ecommerce: [{ ...platform, id: `E-${Date.now()}`, createdAt: new Date().toLocaleDateString('en-GB').replace(/\//g, '-') }, ...state.ecommerce] })),
            updateEcommerce: (id, updates) => set((state) => ({ ecommerce: state.ecommerce.map(e => e.id === id ? { ...e, ...updates } : e) })),
            deleteEcommerce: (ids) => set((state) => ({ ecommerce: state.ecommerce.filter(e => !ids.includes(e.id)) })),

            addPaymentMethod: (pm) => set((state) => ({ paymentMethods: [{ ...pm, id: `PM-${Date.now()}` }, ...state.paymentMethods] })),
            updatePaymentMethod: (id, updates) => set((state) => ({ paymentMethods: state.paymentMethods.map(p => p.id === id ? { ...p, ...updates } : p) })),
            deletePaymentMethods: (ids) => set((state) => ({ paymentMethods: state.paymentMethods.filter(p => !ids.includes(p.id)) })),

            updateAreaShipping: (id, updates) => set((state) => ({ areaShipping: state.areaShipping.map(a => a.id === id ? { ...a, ...updates } : a) })),
        }),
        { name: "erp-settings-storage-v3" } // Cache override for exact sync
    )
);
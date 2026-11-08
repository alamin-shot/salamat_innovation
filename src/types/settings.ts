export type CurrencyCode = "BDT" | "USD" | "EUR" | "GBP";

export interface GeneralConfig {
    companyName: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    currency: CurrencyCode;
    dateFormat: string;
    decimalSeparator: "dot" | "comma";
    thousandSeparator: "dot" | "comma" | "space";
    currencyPosition: "left" | "left_space" | "right" | "right_space";
    taxRate: number;
    taxNumber: string;
    brandColor: string;
    maintenanceMode: boolean;
    logoUrl: string | null;
    iconUrl: string | null;
    bannerUrl: string | null;
}

export interface HRConfig {
    // Payrun
    payrunPeriod: "Monthly" | "Weekly";
    payrunGeneratingType: "Hour" | "Daily log" | "None";
    considerOvertime: boolean;

    // Leave
    leaveStartMonth: string;
    paidLeaveEligibility: string[];
    unpaidLeaveEligibility: string[];

    // Attendance
    punchToleranceMinutes: number;
    workAvailabilityPercent: number;

    // Geolocation
    selectedGeoProvider: "google" | "mapbox" | "ip" | "none";
    apiKeyGoogle: string;
    apiKeyMapbox: string;
    apiKeyIp: string;
}

export interface SecurityConfig {
    global2FAEnforced: boolean;
    sessionTimeoutMinutes: number;
}

export interface NotificationConfig {
    emailGatewayKey: string;
    smsGatewayKey: string;
    notifyOnShopCreate: boolean;
    notifyOnPayrun: boolean;
}

export interface ShopRecord {
    id: string;
    name: string;
    phone: string;
    email: string;
    logoUrl: string | null;
    status: "Active" | "Inactive";
    createdAt: string;
}

export interface EcommerceRecord {
    id: string;
    name: string;
    status: "Active" | "Inactive";
    createdAt: string;
}

export interface PaymentMethodRecord {
    id: string;
    name: string;
    director: string;
    logoUrl: string | null;
}

export interface AreaShippingRecord {
    id: string;
    district: string;
    area: string;
    thana: string;
    postcode: string;
    chargeType: "default" | "free" | "custom";
    customAmount?: number;
}
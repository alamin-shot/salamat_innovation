// LAYER 1: Partners (dealers, retailers, B2B, franchises and partnership applications).
// Future NestJS resource: /api/partners.

export type PartnerType = "dealer" | "retailer" | "b2b" | "franchise" | "application";
/** Types an application can be approved into. */
export type ApprovedPartnerType = Exclude<PartnerType, "application">;

export type PartnerTier = "Platinum" | "Gold" | "Silver" | "Standard";

/** Active / Inactive for partners; Pending / Rejected for applications. */
export type PartnerStatus = "Active" | "Inactive" | "Pending" | "Rejected";

export interface PartnerHistoryEntry {
    /** ISO-8601 */
    at: string;
    event: string;
}

export interface Partner {
    id: string;
    type: PartnerType;
    tier: PartnerTier;
    name: string;
    email: string;
    primaryPhone: string;
    secondaryPhone: string;
    businessName: string;
    tradeLicense: string;
    address: string;
    /** Business logo (scaled data URL until media storage exists). */
    logoUrl: string | null;
    status: PartnerStatus;
    /** ISO-8601 */
    createdAt: string;
    /** Newest last. */
    history: PartnerHistoryEntry[];
}

export type PartnerInput = Pick<Partner, "type" | "tier" | "name" | "email" | "primaryPhone" | "secondaryPhone" | "businessName" | "tradeLicense" | "address" | "logoUrl" | "status">;

export interface PartnerState {
    partners: Partner[];
    addPartner: (partner: PartnerInput) => Partner;
    updatePartner: (id: string, updated: PartnerInput) => void;
    deletePartner: (id: string) => void;
    bulkDeletePartners: (ids: string[]) => void;
    updateStatus: (id: string, status: PartnerStatus) => void;
    /** Moves an application into a partner list as Active. */
    approveApplication: (id: string, type: ApprovedPartnerType) => void;
    rejectApplication: (id: string) => void;
}

/** Counts shown above each partner table (partners are not linked to sales yet). */
export interface PartnerMetrics {
    total: number;
    active: number;
    inactive: number;
    pending: number;
    rejected: number;
    newThisMonth: number;
    byTier: Record<PartnerTier, number>;
}

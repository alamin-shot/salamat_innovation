import { ApprovedPartnerType, PartnerTier, PartnerType } from "@/types/partners";

export const PARTNER_TYPE_LABELS: Readonly<Record<PartnerType, { one: string; many: string }>> = {
    dealer: { one: "Dealer", many: "Dealers" },
    retailer: { one: "Retailer", many: "Retailers" },
    b2b: { one: "B2B Partner", many: "B2B Partners" },
    franchise: { one: "Franchise", many: "Franchises" },
    application: { one: "Application", many: "Applications" },
};

export const PARTNER_TIERS: PartnerTier[] = ["Platinum", "Gold", "Silver", "Standard"];

/** Badge colours per tier. */
export const PARTNER_TIER_STYLES: Readonly<Record<PartnerTier, string>> = {
    Platinum: "bg-slate-800 text-white",
    Gold: "bg-amber-100 text-amber-800 ring-1 ring-amber-300",
    Silver: "bg-gray-100 text-gray-700 ring-1 ring-gray-300",
    Standard: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
};

export const APPROVE_TARGETS: ApprovedPartnerType[] = ["dealer", "retailer", "b2b", "franchise"];

/** Where each list lives (for "approved as" links). */
export const PARTNER_LIST_PATHS: Readonly<Record<PartnerType, string>> = {
    dealer: "/admin/partners/dealers",
    retailer: "/admin/partners/retailers",
    b2b: "/admin/partners/b2b",
    franchise: "/admin/partners/franchises",
    application: "/admin/partners/applications",
};

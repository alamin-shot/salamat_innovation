import { Partner, PartnerMetrics } from "@/types/partners";
import { PARTNER_TIERS } from "@/constants/partners";

/** Counts for one partner list. "New this month" = created in the current calendar month. */
export function partnerMetrics(partners: Partner[], today: Date = new Date()): PartnerMetrics {
    const byTier = Object.fromEntries(PARTNER_TIERS.map((tier) => [tier, partners.filter((partner) => partner.tier === tier).length])) as PartnerMetrics["byTier"];
    return {
        total: partners.length,
        active: partners.filter((partner) => partner.status === "Active").length,
        inactive: partners.filter((partner) => partner.status === "Inactive").length,
        pending: partners.filter((partner) => partner.status === "Pending").length,
        rejected: partners.filter((partner) => partner.status === "Rejected").length,
        newThisMonth: partners.filter((partner) => {
            const created = new Date(partner.createdAt);
            return created.getFullYear() === today.getFullYear() && created.getMonth() === today.getMonth();
        }).length,
        byTier,
    };
}

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Partner, PartnerState } from "@/types/partners";
import { INITIAL_PARTNERS } from "@/mocks/partners.mock";
import { PARTNER_TYPE_LABELS } from "@/constants/partners";

// LAYER 2: Partners cache (future /api/partners). Every status / tier / type change is added to the
// partner's history so the profile drawer can show it.

const now = () => new Date().toISOString();
const withEvent = (partner: Partner, event: string): Partner => ({ ...partner, history: [...partner.history, { at: now(), event }] });

export const usePartnerStore = create<PartnerState>()(
    persist(
        (set) => ({
            partners: INITIAL_PARTNERS,

            addPartner: (input) => {
                const createdAt = now();
                const partner: Partner = {
                    ...input,
                    id: crypto.randomUUID(),
                    createdAt,
                    history: [{ at: createdAt, event: input.type === "application" ? "Application received" : `Added as ${PARTNER_TYPE_LABELS[input.type].one} (${input.tier})` }],
                };
                set((state) => ({ partners: [partner, ...state.partners] }));
                return partner;
            },

            updatePartner: (id, updated) => set((state) => ({
                partners: state.partners.map((item) => {
                    if (item.id !== id) return item;
                    let next: Partner = { ...item, ...updated };
                    if (updated.tier !== item.tier) next = withEvent(next, `Tier changed: ${item.tier} → ${updated.tier}`);
                    if (updated.status !== item.status) next = withEvent(next, `Status changed to ${updated.status}`);
                    return next;
                }),
            })),

            deletePartner: (id) => set((state) => ({ partners: state.partners.filter((item) => item.id !== id) })),

            bulkDeletePartners: (ids) => set((state) => ({ partners: state.partners.filter((item) => !ids.includes(item.id)) })),

            updateStatus: (id, status) => set((state) => ({
                partners: state.partners.map((item) => (item.id === id && item.status !== status ? withEvent({ ...item, status }, `Status changed to ${status}`) : item)),
            })),

            approveApplication: (id, type) => set((state) => ({
                partners: state.partners.map((item) => (item.id === id && item.type === "application"
                    ? withEvent({ ...item, type, status: "Active" }, `Approved as ${PARTNER_TYPE_LABELS[type].one}`)
                    : item)),
            })),

            rejectApplication: (id) => set((state) => ({
                partners: state.partners.map((item) => (item.id === id && item.type === "application" ? withEvent({ ...item, status: "Rejected" }, "Application rejected") : item)),
            })),
        }),
        {
            name: "tekzo_partner_store",
            version: 1,
            // version 1: tiers, history, saved logos (blob: previews never survived a reload), sample data.
            migrate: (persisted) => {
                type OldPartner = Omit<Partner, "tier" | "logoUrl" | "createdAt" | "history" | "status"> & { status: string; logo?: string | null } & Partial<Partner>;
                const state = persisted as { partners?: OldPartner[] };
                const saved = state.partners ?? [];
                if (saved.length === 0) return { partners: INITIAL_PARTNERS } as PartnerState;
                const createdAt = now();
                const partners: Partner[] = saved.map((item) => ({
                    id: item.id,
                    type: item.type,
                    tier: item.tier ?? "Standard",
                    name: item.name,
                    email: item.email,
                    primaryPhone: item.primaryPhone,
                    secondaryPhone: item.secondaryPhone,
                    businessName: item.businessName,
                    tradeLicense: item.tradeLicense,
                    address: item.address,
                    logoUrl: item.logoUrl ?? (item.logo && item.logo.startsWith("data:") ? item.logo : null),
                    status: item.status === "Inactive" ? "Inactive" : item.type === "application" ? "Pending" : "Active",
                    createdAt: item.createdAt ?? createdAt,
                    history: item.history ?? [{ at: createdAt, event: "Partner added" }],
                }));
                return { partners } as PartnerState;
            },
        }
    )
);

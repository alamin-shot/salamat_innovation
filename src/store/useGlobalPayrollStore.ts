import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BeneficiaryItem, BadgeValueItem, PayrunItem, PayslipItem } from "@/types/payroll.types";

interface GlobalPayrollStoreState {
    beneficiaries: BeneficiaryItem[];
    badgeValues: BadgeValueItem[];
    payruns: PayrunItem[];
    payslips: PayslipItem[];

    // Beneficiary Actions
    addBeneficiary: (payload: Omit<BeneficiaryItem, "id">) => void;
    updateBeneficiary: (id: string, payload: Partial<BeneficiaryItem>) => void;
    deleteBeneficiary: (id: string) => void;

    // Badge Value Actions
    saveBadgeValues: (payload: BadgeValueItem[]) => void;
}

const INITIAL_BENEFICIARIES: BeneficiaryItem[] = [
    { id: "ben-1", name: "KPI (Key Performance Indicator)", type: "Allowance", status: "Active", description: "Monthly performance incentive." },
    { id: "ben-2", name: "Late Fee Penalty", type: "Deduction", status: "Active", description: "Deducted based on attendance logs." },
    { id: "ben-3", name: "Provident Fund (PF)", type: "Statutory", status: "Active", description: "Statutory 10% basic deduction." }
];

const INITIAL_BADGE_VALUES: BadgeValueItem[] = [
    { id: "bv-1", beneficiaryId: "ben-1", amount: 3000, computationBase: "Fixed Amount" },
    { id: "bv-2", beneficiaryId: "ben-2", amount: 100, computationBase: "Fixed Amount" },
    { id: "bv-3", beneficiaryId: "ben-3", amount: 10, computationBase: "Percent of Basic" }
];

export const useGlobalPayrollStore = create<GlobalPayrollStoreState>()(
    persist(
        (set) => ({
            beneficiaries: INITIAL_BENEFICIARIES,
            badgeValues: INITIAL_BADGE_VALUES,
            payruns: [],
            payslips: [],

            addBeneficiary: (payload) =>
                set((state) => ({
                    beneficiaries: [{ ...payload, id: `ben-${Date.now()}` }, ...state.beneficiaries]
                })),

            updateBeneficiary: (id, payload) =>
                set((state) => ({
                    beneficiaries: state.beneficiaries.map((b) => (b.id === id ? { ...b, ...payload } : b))
                })),

            deleteBeneficiary: (id) =>
                set((state) => ({
                    beneficiaries: state.beneficiaries.filter((b) => b.id !== id),
                    // Cascade delete badge values attached to this beneficiary
                    badgeValues: state.badgeValues.filter((bv) => bv.beneficiaryId !== id)
                })),

            saveBadgeValues: (payload) =>
                set(() => ({
                    badgeValues: payload
                }))
        }),
        { name: "erp-payroll-storage-v1" } // Forces fresh cache
    )
);
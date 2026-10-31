import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TenantType = "salamat" | "tekzo";

// Matches the exact tabs from your screenshot
export type PolicyTabKey =
    | "warranty_policy"
    | "privacy_policy"
    | "terms_conditions"
    | "refund_policy"
    | "return_policy"
    | "exchange_policy"
    | "delivery_policy"
    | "emi_payment_policy"
    | "preorder_policy"
    | "care_policy";

type TenantPolicies = Record<PolicyTabKey, string>;

interface PolicyStore {
    policies: Record<TenantType, TenantPolicies>;
    updatePolicy: (tenant: TenantType, tabKey: PolicyTabKey, content: string) => void;
}

const defaultPolicies: TenantPolicies = {
    warranty_policy: "<h3>Warranty Policy</h3><p>Salamat Innovation offers a structured Warranty Policy...</p>",
    privacy_policy: "<h3>Privacy Policy</h3><p>Your privacy is important to us...</p>",
    terms_conditions: "<h3>Terms & Conditions</h3><p>By using our services, you agree to...</p>",
    refund_policy: "<h3>Refund Policy</h3><p>Details regarding our refund procedures...</p>",
    return_policy: "<h3>Return Policy</h3><p>How to return a product...</p>",
    exchange_policy: "<h3>Exchange Policy</h3><p>Guidelines for exchanging items...</p>",
    delivery_policy: "<h3>Delivery Policy</h3><p>Shipping times and costs...</p>",
    emi_payment_policy: "<h3>EMI Payment Policy</h3><p>Available EMI options and terms...</p>",
    preorder_policy: "<h3>Preorder Policy</h3><p>Rules for reserving upcoming stock...</p>",
    care_policy: "<h3>Care Policy</h3><p>How to maintain your devices...</p>"
};

export const usePolicyStore = create<PolicyStore>()(
    persist(
        (set) => ({
            policies: {
                salamat: { ...defaultPolicies },
                tekzo: { ...defaultPolicies } // Tekzo starts with defaults, updates are isolated
            },
            updatePolicy: (tenant, tabKey, content) => set((state) => ({
                policies: {
                    ...state.policies,
                    [tenant]: {
                        ...state.policies[tenant],
                        [tabKey]: content
                    }
                }
            }))
        }),
        { name: "erp-policy-storage-v1" }
    )
);
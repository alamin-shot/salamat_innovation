"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { usePolicyStore, TenantType, PolicyTabKey } from "@/store/usePolicyStore";
import { toast } from "sonner";

export const POLICY_TABS: { key: PolicyTabKey; label: string }[] = [
    { key: "warranty_policy", label: "Warranty Policy" },
    { key: "privacy_policy", label: "Privacy Policy" },
    { key: "terms_conditions", label: "Terms & Conditions" },
    { key: "refund_policy", label: "Refund Policy" },
    { key: "return_policy", label: "Return Policy" },
    { key: "exchange_policy", label: "Exchange Policy" },
    { key: "delivery_policy", label: "Delivery Policy" },
    { key: "emi_payment_policy", label: "EMI Payment Policy" },
    { key: "preorder_policy", label: "Preorder Policy" },
    { key: "care_policy", label: "Care Policy" }
];

export function usePolicyManager(tenant: TenantType) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const store = usePolicyStore();

    // Determine active tab from URL, default to warranty_policy
    const activeTabKey = (searchParams.get("tab") as PolicyTabKey) || "warranty_policy";

    // Local state for the WYSIWYG editor
    const [editorContent, setEditorContent] = useState("");

    // Sync local state when the active tab or tenant changes
    useEffect(() => {
        const savedContent = store.policies[tenant][activeTabKey] || "";
        setEditorContent(savedContent);
    }, [tenant, activeTabKey, store.policies]);

    // Handle switching vertical tabs
    const handleTabChange = useCallback((tabKey: PolicyTabKey) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", tabKey);
        router.push(`${pathname}?${params.toString()}`);
    }, [pathname, router, searchParams]);

    // Save the current editor content to the global store
    const handleUpdate = useCallback(() => {
        store.updatePolicy(tenant, activeTabKey, editorContent);
        toast.success(`${POLICY_TABS.find(t => t.key === activeTabKey)?.label} updated successfully!`);
    }, [tenant, activeTabKey, editorContent, store]);

    return {
        tenant,
        activeTabKey,
        editorContent,
        setEditorContent,
        handleTabChange,
        handleUpdate
    };
}

export type PolicyManagerType = ReturnType<typeof usePolicyManager>;
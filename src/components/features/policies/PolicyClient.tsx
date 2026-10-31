"use client";
import { usePolicyManager, POLICY_TABS } from "@/hooks/policy_hooks/usePolicyManager";
import { TenantType } from "@/store/usePolicyStore";
import { SharedAdvancedEditor } from "@/components/shared/SharedAdvancedEditor";
import { Button } from "@/components/ui/Button";
import { ShieldCheck } from "lucide-react";

export function PolicyClient({ tenant }: { tenant: TenantType }) {
    const manager = usePolicyManager(tenant);

    const activeTabLabel = POLICY_TABS.find(t => t.key === manager.activeTabKey)?.label || "Policy";
    const title = tenant === "salamat" ? "Salamat Policy Settings" : "Tekzo Policy Settings";

    return (
        <div className="flex flex-col w-full h-full gap-6 p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-brand-primary" /> {title}
                </h1>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start">

                {/* Left Column: Vertical Tabs */}
                <div className="w-full lg:w-64 shrink-0 erp-card bg-white p-2 flex flex-col gap-1">
                    {POLICY_TABS.map((tab) => {
                        const isActive = manager.activeTabKey === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => manager.handleTabChange(tab.key)}
                                className={`w-full text-left px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive
                                    ? "bg-brand-primary/10 text-brand-primary"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Right Column: Editor & Actions */}
                <div className="flex-1 w-full erp-card bg-white p-6 flex flex-col gap-6">
                    <div className="border-b border-gray-100 pb-4">
                        <h2 className="text-lg font-bold text-gray-800">{activeTabLabel}</h2>
                        <p className="text-xs text-gray-500 mt-1">
                            Update the HTML content for {tenant}'s {activeTabLabel.toLowerCase()}.
                        </p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Value <span className="text-red-500">*</span></label>
                        <SharedAdvancedEditor
                            value={manager.editorContent}
                            onChange={manager.setEditorContent}
                        />
                    </div>

                    <div className="pt-2 flex justify-start">
                        <Button variant="default" onClick={manager.handleUpdate} className="px-8">
                            Update
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
}
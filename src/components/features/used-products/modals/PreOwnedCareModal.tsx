"use client";
import * as React from "react";
import { Search, ChevronDown, Save, Trash2, Check } from "lucide-react";
import { toast } from "sonner";

interface PreOwnedCareModalProps {
    productId: string;
}

const CARE_PLANS = [
    "TEKZO Care for Apple (1 Year Brand New Replacement Guarantee)",
    "TEKZO Screen Care: 365 days, One-time display replacements",
    "DC+ & DSC+ Bundle (1 year brand-new replacement + 365 days display)",
    "TEKZO Ultimate Care 1 year (New replacement for hardware issues)",
    "18 month replacement guarantee",
];

export function PreOwnedCareModal({ productId }: PreOwnedCareModalProps) {
    const [selectedCare, setSelectedCare] = React.useState<string>("TEKZO Care for Apple (1 Year Brand New Replacement Guarantee)");
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");

    const filteredPlans = CARE_PLANS.filter(plan => plan.toLowerCase().includes(searchQuery.toLowerCase()));

    const handleSave = () => {
        toast.success("Pre-owned care plan updated successfully.");
    };

    return (
        <div className="flex flex-col gap-6 p-6 min-h-[300px]">
            <div className="flex flex-col gap-2 relative max-w-xl">
                <label className="text-xs font-bold text-brand-subtext uppercase tracking-wider">Select Care</label>

                {/* Dropdown Trigger */}
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex w-full cursor-pointer items-center justify-between rounded-md border border-brand-subtext/30 bg-white px-3 py-2.5 text-sm text-brand-text shadow-sm hover:border-emerald-500 transition-colors"
                >
                    <span className="font-medium truncate">{selectedCare || "Choose a care"}</span>
                    <ChevronDown className="h-4 w-4 text-brand-subtext shrink-0 ml-2" />
                </div>

                {/* Searchable Dropdown Menu */}
                {isOpen && (
                    <div className="absolute left-0 top-[calc(100%+4px)] z-50 w-full rounded-xl border border-brand-subtext/20 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
                        <div className="sticky top-0 bg-white p-2.5 border-b border-brand-subtext/10">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-brand-subtext" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Search care plans..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-lg border border-brand-subtext/20 bg-brand-bg/40 py-1.5 pl-8 pr-3 text-sm focus:border-emerald-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="max-h-60 overflow-y-auto p-1.5 custom-scrollbar">
                            {filteredPlans.length > 0 ? (
                                filteredPlans.map((plan) => (
                                    <div
                                        key={plan}
                                        onClick={() => {
                                            setSelectedCare(plan);
                                            setIsOpen(false);
                                            setSearchQuery("");
                                        }}
                                        className="flex items-center justify-between cursor-pointer rounded-lg px-3 py-2.5 text-xs font-medium text-brand-text hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                                    >
                                        <span>{plan}</span>
                                        {selectedCare === plan && <Check className="h-4 w-4 text-emerald-600" />}
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center text-xs text-brand-subtext">no_options_found</div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Action Footer */}
            <div className="flex items-center justify-between pt-6 border-t border-brand-subtext/10 mt-auto">
                <button
                    onClick={() => setSelectedCare("")}
                    className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50"
                    title="Remove Care"
                >
                    <Trash2 className="h-5 w-5" />
                </button>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 rounded-md bg-emerald-600 px-6 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700"
                >
                    <Save className="h-4 w-4" /> Save
                </button>
            </div>
        </div>
    );
}
"use client";
import * as React from "react";
import { Trash2, Plus, Save, Wand2, Loader2, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

interface SpecificationsFormProps {
    productId?: string | null;
}

interface SpecRow {
    id: string;
    name: string;
    value: string;
}

export function SpecificationsForm({ productId }: SpecificationsFormProps) {
    // Initial state with a placeholder row
    const [specs, setSpecs] = React.useState<SpecRow[]>([
        { id: "1", name: "", value: "" },
    ]);

    // Scraper State
    const [scrapeUrl, setScrapeUrl] = React.useState("");
    const [isScraping, setIsScraping] = React.useState(false);

    const handleScrape = async () => {
        if (!scrapeUrl) {
            toast.error("Please enter a valid URL first.");
            return;
        }

        setIsScraping(true);

        // Simulating the 2.5 second backend AI extraction process
        await new Promise(resolve => setTimeout(resolve, 2500));

        // Mock data that the AI would return from a site like GSMArena
        const extractedSpecs: SpecRow[] = [
            { id: Date.now() + "-1", name: "Display", value: "6.78 inches AMOLED, 120Hz, HDR10+" },
            { id: Date.now() + "-2", name: "Processor", value: "Qualcomm Snapdragon 7 Gen 3 (4 nm)" },
            { id: Date.now() + "-3", name: "RAM", value: "8GB / 12GB LPDDR5" },
            { id: Date.now() + "-4", name: "Storage", value: "256GB / 512GB UFS 3.1 (No Card Slot)" },
            { id: Date.now() + "-5", name: "Main Camera", value: "50 MP OIS (Wide) + 8 MP (Ultrawide)" },
            { id: Date.now() + "-6", name: "Selfie Camera", value: "50 MP, f/2.0, 22mm (wide), AF" },
            { id: Date.now() + "-7", name: "Battery", value: "5000 mAh, non-removable, 80W wired" },
            { id: Date.now() + "-8", name: "OS", value: "Android 14, Funtouch 14" },
        ];

        // Remove empty placeholder rows and append the new extracted data
        setSpecs(prev => {
            const cleaned = prev.filter(s => s.name.trim() !== "" || s.value.trim() !== "");
            return [...cleaned, ...extractedSpecs];
        });

        setIsScraping(false);
        setScrapeUrl("");
        toast.success("Successfully extracted 8 specifications!");
    };

    const addRow = () => {
        setSpecs([...specs, { id: Date.now().toString(), name: "", value: "" }]);
    };

    const removeRow = (id: string) => {
        setSpecs(specs.filter(s => s.id !== id));
    };

    const updateRow = (id: string, field: "name" | "value", val: string) => {
        setSpecs(specs.map(s => s.id === id ? { ...s, [field]: val } : s));
    };

    const handleSave = () => {
        const validSpecs = specs.filter(s => s.name.trim() !== "" && s.value.trim() !== "");
        toast.success(`Saved ${validSpecs.length} specifications successfully.`);
    };

    return (
        <div className="flex flex-col gap-6 h-full">

            {/* The Magic Scraper Zone */}
            <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-5 shadow-sm transition-colors hover:border-indigo-300">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <Wand2 className="h-5 w-5 text-indigo-600" />
                        <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider">AI Auto-Extract</h3>
                    </div>
                    <p className="text-sm text-indigo-700/80">
                        Paste a link from a manufacturer or tech site. Our engine will instantly extract and map the technical specifications for you.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-3 mt-1">
                        <div className="relative w-full">
                            <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-400" />
                            <input
                                type="url"
                                placeholder="https://example.com/product-page"
                                value={scrapeUrl}
                                onChange={(e) => setScrapeUrl(e.target.value)}
                                disabled={isScraping}
                                className="w-full rounded-md border border-indigo-200 bg-white py-2 pl-9 pr-3 text-sm text-brand-text focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-60"
                            />
                        </div>
                        <button
                            onClick={handleScrape}
                            disabled={isScraping || !scrapeUrl}
                            className="flex w-full sm:w-auto shrink-0 items-center justify-center gap-2 rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 disabled:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            {isScraping ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" /> Extracting...
                                </>
                            ) : (
                                <>
                                    Import Specs
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Manual Specification Table */}
            <div className="flex flex-col gap-4 flex-1">
                <div className="grid grid-cols-12 gap-4 text-xs font-bold text-brand-subtext uppercase border-b border-brand-subtext/20 pb-2">
                    <div className="col-span-4">Specification Name</div>
                    <div className="col-span-7">Value</div>
                    <div className="col-span-1 text-center">Action</div>
                </div>

                <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar pb-2">
                    {specs.map((spec) => (
                        <div key={spec.id} className="grid grid-cols-12 gap-4 items-start group">
                            <div className="col-span-4">
                                <input
                                    type="text"
                                    placeholder="e.g. Display Type"
                                    value={spec.name}
                                    onChange={(e) => updateRow(spec.id, "name", e.target.value)}
                                    className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm font-medium text-brand-text focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary transition-colors"
                                />
                            </div>
                            <div className="col-span-7">
                                <input
                                    type="text"
                                    placeholder="e.g. AMOLED, 120Hz"
                                    value={spec.value}
                                    onChange={(e) => updateRow(spec.id, "value", e.target.value)}
                                    className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary transition-colors"
                                />
                            </div>
                            <div className="col-span-1 flex justify-center pt-2">
                                <button
                                    onClick={() => removeRow(spec.id)}
                                    className="text-brand-subtext opacity-50 hover:opacity-100 hover:text-red-500 transition-all focus:outline-none"
                                    title="Remove Row"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-1 flex items-center justify-between border-t border-brand-subtext/20 pt-4">
                    <button
                        onClick={addRow}
                        className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold text-brand-primary hover:bg-brand-primary/10 transition-colors focus:outline-none"
                    >
                        <Plus className="h-4 w-4" /> Add Row
                    </button>

                    {/* The Save action is only heavily styled when used outside the Master Form */}
                    {!productId && (
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 rounded-md bg-emerald-600 px-6 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-700 focus:outline-none"
                        >
                            <Save className="h-4 w-4" /> Save Specifications
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
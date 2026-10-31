"use client";
import { useState, useEffect } from "react";
import { FaqManagerType } from "@/hooks/faq_hooks/useFaqManager";
import { FaqStatus, FaqTranslation } from "@/store/useFaqStore";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { RichTextEditor } from "@/components/shared/RichTextEditor";

const emptyTranslation: FaqTranslation = { question: "", answer: "" };

export function FaqDrawer({ manager }: { manager: FaqManagerType }) {
    const isEdit = manager.activeDrawer === "edit";
    const activeFaq = manager.getActiveFaq();

    // Form State
    const [shopName, setShopName] = useState("");
    const [order, setOrder] = useState<number>(0);
    const [status, setStatus] = useState<FaqStatus>("Active");

    // Translation State
    const [activeTab, setActiveTab] = useState<"en" | "bn">("en");
    const [translations, setTranslations] = useState<{ en: FaqTranslation, bn: FaqTranslation }>({
        en: { ...emptyTranslation },
        bn: { ...emptyTranslation }
    });

    useEffect(() => {
        if (isEdit && activeFaq) {
            setShopName(activeFaq.shopName);
            setOrder(activeFaq.order);
            setStatus(activeFaq.status);
            setTranslations({
                en: { ...activeFaq.translations.en },
                bn: { ...activeFaq.translations.bn }
            });
        } else if (manager.activeDrawer === "add") {
            setShopName("");
            setOrder(0);
            setStatus("Active");
            setTranslations({ en: { ...emptyTranslation }, bn: { ...emptyTranslation } });
            setActiveTab("en");
        }
    }, [isEdit, activeFaq, manager.activeDrawer]);

    const handleTranslationChange = (field: keyof FaqTranslation, value: string) => {
        setTranslations(prev => ({
            ...prev,
            [activeTab]: { ...prev[activeTab], [field]: value }
        }));
    };

    const onSubmit = () => {
        manager.handleSubmit({ shopName, order, status, translations });
    };

    return (
        <Drawer
            title={isEdit ? "Update FAQ" : "Add FAQ"}
            isOpen={manager.activeDrawer !== "none"}
            onClose={manager.closeDrawer}
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 w-full flex flex-col gap-6 px-6 overflow-y-auto custom-scrollbar pb-12">

                    {/* Top Section: Meta Data */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Shop Name (Tenant) <span className="text-red-500">*</span></label>
                            <CustomSelect
                                value={shopName}
                                options={["Global Store", "Apple&Series", "Gadget & Gear"]}
                                onChange={(val) => setShopName(val)}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Order</label>
                            <input
                                type="number"
                                className="erp-input"
                                value={order}
                                onChange={(e) => setOrder(Number(e.target.value))}
                                min={0}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Status</label>
                            <CustomSelect
                                value={status}
                                options={["Active", "Inactive"]}
                                onChange={(val) => setStatus(val as FaqStatus)}
                            />
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Language Tabs */}
                    <div className="flex border-b border-gray-200">
                        <button
                            className={`px-6 py-2.5 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'en' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('en')}
                        >
                            English
                        </button>
                        <button
                            className={`px-6 py-2.5 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'bn' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('bn')}
                        >
                            বাংলা
                        </button>
                    </div>

                    {/* Translatable Inputs */}
                    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Question ({activeTab.toUpperCase()}) <span className="text-red-500">*</span></label>
                            <textarea
                                className="erp-input h-20 resize-none"
                                value={translations[activeTab].question}
                                onChange={(e) => handleTranslationChange('question', e.target.value)}
                                placeholder={activeTab === 'en' ? "e.g., What is your return policy?" : "যেমন, আপনাদের রিটার্ন পলিসি কি?"}
                            />
                        </div>

                        <RichTextEditor
                            label={`Answer (${activeTab.toUpperCase()})`}
                            value={translations[activeTab].answer}
                            onChange={(val) => handleTranslationChange('answer', val)}
                        />
                    </div>

                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white mt-auto shrink-0 px-6 pb-4">
                    <Button variant="outline" onClick={manager.closeDrawer} className="px-6 h-9">Cancel</Button>
                    <Button variant="default" onClick={onSubmit} className="px-8 h-9">
                        {isEdit ? "Update FAQ" : "Save FAQ"}
                    </Button>
                </div>
            </div>
        </Drawer>
    );
}
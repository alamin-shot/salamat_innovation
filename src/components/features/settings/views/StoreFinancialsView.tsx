"use client";
import { useState } from "react";
import Link from "next/link";
import { useSettingsManager } from "@/hooks/settings_hooks/useSettingsManager";

import { EcommerceTable } from "../tables/EcommerceTable";

import { EcommerceDrawer } from "../drawers/EcommerceDrawer";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Plus, Store, CreditCard, Globe } from "lucide-react";
import { ShopsMasterTable } from "../tables/ShopsMasterTable";
import { PaymentMethodsTable } from "../tables/PaymentMethodsTable";
import { ShopFormDrawer } from "../drawers/ShopFormDrawer";
import { PaymentMethodDrawer } from "../drawers/PaymentMethodDrawer";

export function StoreFinancialsView() {
    // 3 Independent Managers so selections and pagination do not bleed across tabs
    const shopManager = useSettingsManager("shops");
    const paymentManager = useSettingsManager("paymentMethods");
    const ecommerceManager = useSettingsManager("ecommerce");

    const [activeTab, setActiveTab] = useState<"shops" | "payments" | "ecommerce">("shops");

    // Dynamic routing for the "Add" button
    const activeManager = activeTab === "shops" ? shopManager : activeTab === "payments" ? paymentManager : ecommerceManager;
    const buttonText = activeTab === "shops" ? "Add Shop" : activeTab === "payments" ? "Add Payment Method" : "Add Platform";
    const targetDrawer = activeTab === "shops" ? "shop_form" : activeTab === "payments" ? "payment_form" : "ecommerce_form";

    return (
        <div className="flex flex-col w-full rounded-xl border border-brand-subtext/15 bg-gray-50/50">
            <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/admin/settings" className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-500 hover:bg-brand-primary hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-black text-gray-900 tracking-tight">Store & Financials</h1>
                        <p className="text-xs text-gray-500 mt-1">Manage physical retail shops, e-commerce, and gateways.</p>
                    </div>
                </div>
                <Button
                    variant="default"
                    className="bg-brand-primary text-white shadow-md hover:shadow-lg shrink-0"
                    onClick={() => {
                        activeManager.setActiveRecord(null);
                        activeManager.setDrawerMode(targetDrawer as any);
                    }}
                >
                    <Plus className="w-4 h-4 mr-2" /> {buttonText}
                </Button>
            </div>

            <div className="px-4 sm:px-6 pt-4 shrink-0">
                <div className="flex border-b border-gray-200 gap-6 overflow-x-auto custom-scrollbar">
                    <button onClick={() => setActiveTab("shops")} className={`pb-3 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === "shops" ? "border-brand-primary text-brand-primary" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                        <Store className="w-4 h-4" /> Retail Shops
                    </button>
                    <button onClick={() => setActiveTab("ecommerce")} className={`pb-3 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === "ecommerce" ? "border-brand-primary text-brand-primary" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                        <Globe className="w-4 h-4" /> E-commerce Platforms
                    </button>
                    <button onClick={() => setActiveTab("payments")} className={`pb-3 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === "payments" ? "border-brand-primary text-brand-primary" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                        <CreditCard className="w-4 h-4" /> Payment Methods
                    </button>
                </div>
            </div>

            <div className="p-4 sm:p-6 flex flex-col">
                {activeTab === "shops" && <ShopsMasterTable manager={shopManager} />}
                {activeTab === "ecommerce" && <EcommerceTable manager={ecommerceManager} />}
                {activeTab === "payments" && <PaymentMethodsTable manager={paymentManager} />}
            </div>

            <ShopFormDrawer manager={shopManager} />
            <EcommerceDrawer manager={ecommerceManager} />
            <PaymentMethodDrawer manager={paymentManager} />
        </div>
    );
}
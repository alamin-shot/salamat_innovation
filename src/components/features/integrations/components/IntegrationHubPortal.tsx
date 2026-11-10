"use client";
import { getIntegrationHubCategories } from "@/hooks/integrations_hooks/integrationHubFactory";

export function IntegrationHubPortal({ manager }: { manager: any }) {
    const categories = getIntegrationHubCategories();

    return (
        <div className="flex flex-col gap-8 pb-10 max-w-6xl mx-auto w-full p-4 sm:p-6 animate-in fade-in duration-300">
            {categories.map((cat) => (
                <div key={cat.title} className="flex flex-col gap-3">
                    <div className="flex flex-col">
                        <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider pl-1 border-l-4 border-brand-primary">
                            {cat.title}
                        </h2>
                        <p className="text-xs text-gray-500 mt-1 pl-2">{cat.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-2">
                        {cat.items.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => manager.handleRouteChange("tab", item.id)}
                                    className="group erp-card bg-white p-5 border border-gray-200 hover:border-brand-primary/50 hover:shadow-md transition-all text-left flex items-start gap-4 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 transition-transform group-hover:scale-105 ${item.color}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <span className="font-bold text-gray-900 group-hover:text-brand-primary transition-colors">
                                            {item.label}
                                        </span>
                                        <span className="text-xs text-gray-500 mt-1 leading-relaxed">
                                            {item.desc}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
"use client";
import Link from "next/link";
import { useClosingManager } from "@/hooks/daily_closing_hooks/useClosingManager";
import { ClosingSpokeKey } from "@/constants/hubRoutes";
import { useGlobalClosingStore } from "@/store/useGlobalClosingStore";
import { closingSpokeHref, getHubCategories } from "@/hooks/daily_closing_hooks/closingHubFactory";

export function ClosingHubPortal({ manager }: { manager: ReturnType<typeof useClosingManager> }) {
    const store = useGlobalClosingStore();

    const getCount = (arr: { date: string }[]) => arr.filter(t => t.date === manager.activeDate).length;

    const dynamicCounts: Partial<Record<ClosingSpokeKey, number>> = {
        daily_closing_balance: getCount(store.dailyClosingBalances),
        profit_loss: getCount(store.profitLoss),
        daily_bank: getCount(store.dailyBankRecords),
        sale: getCount(store.sales),
        purchase: getCount(store.purchases),
        expense: getCount(store.expenses),
        withdrawal: getCount(store.withdrawals),
        deposit: getCount(store.deposits),
        sale_return: getCount(store.salesReturns),
        purchase_return: getCount(store.purchaseReturns),
        stock: getCount(store.stockStatements),
        balance_sheet: getCount(store.balanceSheets)
    };

    const categories = getHubCategories(dynamicCounts);
    return (
        <div className="flex flex-col gap-8 pb-10">
            {categories.map((cat) => (
                <div key={cat.title} className="flex flex-col gap-3">
                    <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider pl-1 border-l-4 border-brand-primary">
                        {cat.title}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {cat.items.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.id}
                                    href={closingSpokeHref(item.id, manager.activeDate)}
                                    className="group erp-card bg-white p-5 border border-gray-200 hover:border-brand-primary/50 hover:shadow-md transition-all text-left flex items-start gap-4 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 transition-transform group-hover:scale-105 ${item.color}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-gray-900 group-hover:text-brand-primary transition-colors">
                                                {item.label}
                                            </span>
                                            {item.count !== undefined && item.count > 0 && (
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-900 text-white shadow-2xs">
                                                    {item.count}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                                            {item.desc}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
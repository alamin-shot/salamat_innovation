"use client";
import { Button } from "@/components/ui/Button";
import { LayoutGrid } from "lucide-react";
import { useDirectorListManager } from "@/hooks/people_hooks/director_profile_hooks/useDirectorListManager";
import { DirectorProfileFormDrawer } from "./form-drawer/DirectorProfileFormDrawer";
import { formatCurrency } from "@/utils/formatters";

export function DirectorListClient() {
    const manager = useDirectorListManager();

    return (
        <div className="flex flex-col w-full h-full p-4 sm:p-6 lg:p-8 relative overflow-hidden bg-gray-50/50">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-gray-700 font-bold text-lg tracking-wide uppercase">
                    <LayoutGrid className="h-5 w-5 text-brand-text" />
                    DIRECTOR PROFILES
                </div>
                <Button variant="success" onClick={manager.handleCreateNew} className="rounded-md">Create Profile +</Button>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2 pb-10">
                {manager.directorCards.map(card => (
                    <div key={card.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6">

                        {/* Left: Info */}
                        <div className="flex items-center gap-5 w-full md:w-auto">
                            <div className="w-20 h-20 rounded-full bg-emerald-800 text-white flex items-center justify-center text-2xl font-bold shadow-md">
                                {card.avatar}
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-xl font-bold text-gray-900">{card.fullName}</h3>
                                <p className="text-sm text-gray-500 font-medium">{card.title}</p>
                                <div className="mt-3">
                                    <Button variant="success" onClick={() => manager.handleViewProfile(card.id)} className="px-6 rounded-md">View ❯</Button>
                                </div>
                            </div>
                        </div>

                        {/* Right: Financials */}
                        <div className="flex flex-col items-end w-full md:w-auto text-right border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                            <div className="flex gap-8 mb-2">
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">Total Withdraw</span>
                                    <span className="text-lg font-bold text-gray-800">{formatCurrency(card.totalWithdraw)}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">Total Deposit</span>
                                    <span className="text-lg font-bold text-gray-800">{formatCurrency(card.totalDeposit)}</span>
                                </div>
                            </div>
                            <div className="flex flex-col mb-4">
                                <span className="text-[10px] text-gray-400">(deposit - withdrawal = balance) Total Balance</span>
                                <span className={`text-xl font-bold ${card.totalBalance < 0 ? 'text-red-500' : 'text-gray-900'}`}>{formatCurrency(card.totalBalance)}</span>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => manager.handleEditProfile(card.id)} className="text-xs text-gray-600 border-gray-300 rounded-md">
                                Edit Profile ✎
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <DirectorProfileFormDrawer initialRecord={manager.activeEditRecord} isOpen={manager.activeDrawer === "edit-director"} onClose={manager.closeView} />
        </div>
    );
}
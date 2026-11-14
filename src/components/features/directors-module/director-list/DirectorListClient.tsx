"use client";
import { LayoutGrid, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useDirectorListManager } from "@/hooks/people_hooks/director_profile_hooks/useDirectorListManager";
import { formatCurrency } from "@/utils/formatters";
import { DirectorProfileFormDrawer } from "./form-drawer/DirectorProfileFormDrawer";
import { DirectorAvatar } from "../shared/DirectorAvatar";

export function DirectorListClient() {
    const manager = useDirectorListManager();

    return (
        <div className="relative flex min-h-full w-full flex-col bg-gray-50/50 p-4">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-lg font-bold uppercase tracking-wide text-gray-700">
                    <LayoutGrid className="h-5 w-5 text-brand-text" />
                    DIRECTOR PROFILES
                </div>
                <Button variant="success" onClick={manager.handleCreateNew} className="rounded-md">Create Profile +</Button>
            </div>

            {manager.directorCards.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
                    <Users className="h-8 w-8 text-brand-subtext/60" />
                    <h3 className="text-sm font-bold text-brand-text">No directors yet</h3>
                    <p className="text-xs text-brand-subtext">Create a profile to start recording deposits and withdrawals.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4 pb-10">
                    {manager.directorCards.map((card) => (
                        <div key={card.id} className="flex flex-col items-center justify-between gap-2 rounded-xl border border-gray-100 bg-white p-6 shadow-sm md:flex-row">
                            <div className="flex w-full items-center gap-5 md:w-auto">
                                <DirectorAvatar name={card.fullName} avatarUrl={card.avatarUrl} size="lg" />
                                <div className="flex flex-col">
                                    <h3 className="text-xl font-bold text-gray-900">{card.fullName}</h3>
                                    <p className="text-sm font-medium text-gray-500">{card.title}</p>
                                    <div className="mt-3">
                                        <Button variant="success" onClick={() => manager.handleViewProfile(card.id)} className="rounded-md px-6">View ❯</Button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex w-full flex-col items-end border-t border-gray-100 pt-4 text-right md:w-auto md:border-l md:border-t-0 md:pl-6 md:pt-0">
                                <div className="mb-2 flex gap-8">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500">Total Withdraw ({card.withdrawalCount})</span>
                                        <span className="text-lg font-bold tabular-nums text-gray-800">{formatCurrency(card.totalWithdraw)}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500">Total Deposit</span>
                                        <span className="text-lg font-bold tabular-nums text-gray-800">{formatCurrency(card.totalDeposit)}</span>
                                    </div>
                                </div>
                                <div className="mb-4 flex flex-col">
                                    <span className="text-[10px] text-gray-400">(deposit - withdrawal = balance) Total Balance</span>
                                    <span className={`text-xl font-bold tabular-nums ${card.totalBalance < 0 ? "text-rose-600" : "text-gray-900"}`}>{formatCurrency(card.totalBalance)}</span>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => manager.handleEditProfile(card.id)} className="rounded-md border-gray-300 text-xs text-gray-600">
                                    Edit Profile ✎
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <DirectorProfileFormDrawer director={manager.activeEditRecord} isOpen={manager.isEditOpen} onClose={manager.closeView} />
        </div>
    );
}

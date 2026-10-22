"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";
import { useDirectorProfileStore } from "./useDirectorProfileStore";
import { useDepositStore } from "@/hooks/finance_hooks/deposit_hooks/useDepositStore";
import { useWithdrawalStore } from "@/hooks/finance_hooks/withdrawal_hooks/useWithdrawalStore";

export function useDirectorListManager() {
    const router = useRouter();
    const { activeDrawer, activeId, openView, closeView } = useCommandParams();
    const { profiles } = useDirectorProfileStore();
    const { deposits } = useDepositStore();
    const { withdrawals } = useWithdrawalStore();

    // Map profiles and dynamically calculate financial totals
    const directorCards = useMemo(() => {
        return profiles.map(profile => {
            const dirDeposits = deposits.filter(d => d.directorId === profile.id);
            const dirWithdrawals = withdrawals.filter(w => w.directorId === profile.id);

            const totalDeposit = dirDeposits.reduce((sum, d) => sum + d.amount, 0);
            const totalWithdraw = dirWithdrawals.reduce((sum, w) => sum + w.amount, 0);
            const totalBalance = totalDeposit - totalWithdraw;

            return { ...profile, totalDeposit, totalWithdraw, totalBalance };
        });
    }, [profiles, deposits, withdrawals]);

    const activeEditRecord = useMemo(() => profiles.find(p => p.id === activeId) || null, [profiles, activeId]);

    const handleCreateNew = () => router.push('/admin/directors/create-directors');
    const handleViewProfile = (id: string) => router.push(`/director-profile/${id}`);
    const handleEditProfile = (id: string) => openView("drawer", "edit-director", id);

    return { directorCards, activeDrawer, closeView, activeEditRecord, handleCreateNew, handleViewProfile, handleEditProfile };
}
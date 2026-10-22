"use client";
import { useMemo, useState } from "react";
import { useTableManager } from "@/hooks/shared_hooks/useTableManager";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";
import { useDirectorProfileStore } from "./useDirectorProfileStore";
import { useDepositStore, Deposit } from "@/hooks/finance_hooks/deposit_hooks/useDepositStore";
import { useWithdrawalStore, Withdrawal } from "@/hooks/finance_hooks/withdrawal_hooks/useWithdrawalStore";

export function useDirectorViewManager(directorId: string) {
    const { activeDrawer, openView, closeView } = useCommandParams();
    const { profiles } = useDirectorProfileStore();
    const { deposits } = useDepositStore();
    const { withdrawals } = useWithdrawalStore();

    // Setup Profile Summary Data
    const profile = useMemo(() => profiles.find(p => p.id === directorId) || null, [profiles, directorId]);
    const dirDeposits = useMemo(() => deposits.filter(d => d.directorId === directorId), [deposits, directorId]);
    const dirWithdrawals = useMemo(() => withdrawals.filter(w => w.directorId === directorId), [withdrawals, directorId]);

    const totalDeposit = dirDeposits.reduce((sum, d) => sum + d.amount, 0);
    const totalWithdraw = dirWithdrawals.reduce((sum, w) => sum + w.amount, 0);
    const totalBalance = totalDeposit - totalWithdraw;

    // Independent Table Managers
    const depositTable = useTableManager<Deposit>(dirDeposits, (item, query) => item.title.toLowerCase().includes(query.toLowerCase()));
    const withdrawalTable = useTableManager<Withdrawal>(dirWithdrawals, (item, query) => item.title.toLowerCase().includes(query.toLowerCase()));

    // Pagination specific logic (Keeping it minimal for View tables)
    const [depPage, setDepPage] = useState(1);
    const [wthPage, setWthPage] = useState(1);
    const itemsPerPage = 5;

    const paginatedDeposits = useMemo(() => depositTable.filteredData.slice((depPage - 1) * itemsPerPage, depPage * itemsPerPage), [depositTable.filteredData, depPage]);
    const paginatedWithdrawals = useMemo(() => withdrawalTable.filteredData.slice((wthPage - 1) * itemsPerPage, wthPage * itemsPerPage), [withdrawalTable.filteredData, wthPage]);

    const handleEditProfile = () => openView("drawer", "edit-director", directorId);
    const handleDownloadPDF = () => alert("Downloading PDF...");

    return {
        profile, totalDeposit, totalWithdraw, totalBalance,
        depositTable: { ...depositTable, paginatedData: paginatedDeposits },
        withdrawalTable: { ...withdrawalTable, paginatedData: paginatedWithdrawals },
        activeDrawer, closeView, handleEditProfile, handleDownloadPDF
    };
}
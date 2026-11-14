import { useMemo } from "react";
import { useGlobalDirectorsStore } from "@/store/useGlobalDirectorsStore";
import { useDepositStore } from "@/hooks/finance_hooks/deposit_hooks/useDepositStore";
import { useWithdrawalStore } from "@/hooks/finance_hooks/withdrawal_hooks/useWithdrawalStore";
import { DirectorSummary } from "@/types/directors";

const money = (value: number) => Math.round(value * 100) / 100;

/** Every director with deposit / withdrawal totals and count, computed from the records. */
export function useDirectorSummaries(): DirectorSummary[] {
    const directors = useGlobalDirectorsStore((state) => state.directors);
    const deposits = useDepositStore((state) => state.deposits);
    const withdrawals = useWithdrawalStore((state) => state.withdrawals);

    return useMemo(() => directors.map((director) => {
        const own = withdrawals.filter((record) => record.directorId === director.id);
        const totalDeposit = money(deposits.filter((record) => record.directorId === director.id).reduce((sum, record) => sum + record.amount, 0));
        const totalWithdraw = money(own.reduce((sum, record) => sum + record.amount, 0));
        return { ...director, totalDeposit, totalWithdraw, totalBalance: money(totalDeposit - totalWithdraw), withdrawalCount: own.length };
    }), [directors, deposits, withdrawals]);
}

/** "Choose Director" options for Deposits and Withdrawals: the Directors store only. */
export function useDirectorOptions(): { value: string; label: string }[] {
    const directors = useGlobalDirectorsStore((state) => state.directors);
    return useMemo(() => directors.map((director) => ({ value: director.id, label: director.fullName })), [directors]);
}

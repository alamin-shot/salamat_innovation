import { useMemo } from "react";
import { useLocalListControls } from "@/hooks/shared_hooks/useLocalListControls";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";
import { useDepositStore, Deposit } from "@/hooks/finance_hooks/deposit_hooks/useDepositStore";
import { useWithdrawalStore, Withdrawal } from "@/hooks/finance_hooks/withdrawal_hooks/useWithdrawalStore";
import { useDirectorSummaries } from "./useDirectorSummaries";

const matchesTitle = (item: Deposit | Withdrawal, query: string) => {
    const q = query.toLowerCase();
    return [item.title, item.shopName, item.note, item.date].some((text) => text.toLowerCase().includes(q));
};

const VIEW_PAGE_SIZE = 5;

/** Director profile page: summary, that director's deposits and withdrawals, and the edit drawer. */
export function useDirectorViewManager(directorId: string) {
    const { activeDrawer, openView, closeView } = useCommandParams();
    const profile = useDirectorSummaries().find((director) => director.id === directorId) ?? null;
    const deposits = useDepositStore((state) => state.deposits);
    const withdrawals = useWithdrawalStore((state) => state.withdrawals);

    const ownDeposits = useMemo(() => deposits.filter((record) => record.directorId === directorId), [deposits, directorId]);
    const ownWithdrawals = useMemo(() => withdrawals.filter((record) => record.directorId === directorId), [withdrawals, directorId]);

    const depositTable = useLocalListControls<Deposit>(ownDeposits, matchesTitle, VIEW_PAGE_SIZE);
    const withdrawalTable = useLocalListControls<Withdrawal>(ownWithdrawals, matchesTitle, VIEW_PAGE_SIZE);

    return {
        profile,
        depositTable,
        withdrawalTable,
        isEditOpen: activeDrawer === "edit-director",
        closeView,
        handleEditProfile: () => openView("drawer", "edit-director", directorId),
    };
}

export type DirectorViewManager = ReturnType<typeof useDirectorViewManager>;

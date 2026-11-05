import { useState, useMemo, useDeferredValue } from "react";
import { useGlobalLedgerStore } from "@/store/useGlobalLedgerStore";

export function useLedgerManager() {
    const store = useGlobalLedgerStore();

    // --- ROUTING & UI STATE ---
    const [activeModule, setActiveModule] = useState<"accounts" | "journal" | "reconciliation">("accounts");
    const [drawerMode, setDrawerMode] = useState<"none" | "account" | "transaction" | "statement">("none");
    const [activeRecord, setActiveRecord] = useState<any | null>(null);

    // --- FILTERING & PAGINATION ---
    const [searchQuery, setSearchQuery] = useState("");
    const deferredSearch = useDeferredValue(searchQuery);
    const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: "", end: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    // Global Book Closure Lock (Simulated system setting)
    const bookClosureDate = "2026-10-31T23:59:59Z";

    // --- ENGINE 1: Running Balance Calculation (For Journal) ---
    const globalJournal = useMemo(() => {
        // 1. Sort transactions chronologically (Oldest first to calculate running balance)
        const sortedTx = [...store.transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        let runningBal = 0;
        const mappedJournal = sortedTx.map(tx => {
            // Debits decrease balance (money out/receivable), Credits increase balance (money in/payable) 
            // *Accounting logic can flip based on Liability vs Asset, but standardizing for UI flow:
            if (tx.status !== "Bounced" && tx.status !== "Pending") {
                if (tx.type === "Credit") runningBal += tx.totalAmount;
                if (tx.type === "Debit") runningBal -= tx.totalAmount;
            }
            return { ...tx, computedRunningBalance: runningBal };
        });

        // 2. Filter by search & date, then reverse for UI (Newest on top)
        return mappedJournal.filter(tx => {
            const matchesSearch = tx.referenceNumber?.toLowerCase().includes(deferredSearch.toLowerCase()) || false;
            const matchesDate = (!dateRange.start || new Date(tx.date) >= new Date(dateRange.start)) &&
                (!dateRange.end || new Date(tx.date) <= new Date(dateRange.end));
            return matchesSearch && matchesDate;
        }).reverse();
    }, [store.transactions, deferredSearch, dateRange]);

    // --- ENGINE 2: AR/AP Aging Calculation (For Accounts Dashboard) ---
    const accountsWithAging = useMemo(() => {
        const today = new Date().getTime();
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;

        return store.accounts.map(account => {
            const accountTx = store.transactions.filter(t => t.accountId === account.id && t.status !== "Bounced");

            let totalBalance = account.openingBalance;
            let overdue30 = 0;
            let overdue60 = 0;
            let overdue90 = 0;

            accountTx.forEach(tx => {
                // Calculate Balance
                if (tx.type === "Credit") totalBalance += tx.totalAmount;
                if (tx.type === "Debit") totalBalance -= tx.totalAmount;

                // Aging Logic for Pending/Uncleared Debits (Money owed to you)
                if (tx.type === "Debit" && tx.status === "Pending") {
                    const txAge = today - new Date(tx.date).getTime();
                    if (txAge > thirtyDays * 3) overdue90 += tx.totalAmount;
                    else if (txAge > thirtyDays * 2) overdue60 += tx.totalAmount;
                    else if (txAge > thirtyDays) overdue30 += tx.totalAmount;
                }
            });

            return {
                ...account,
                computedBalance: totalBalance,
                aging: { overdue30, overdue60, overdue90 }
            };
        });
    }, [store.accounts, store.transactions]);

    // --- PERMISSIONS ENGINE ---
    const isRecordLocked = (dateStr: string) => {
        return new Date(dateStr).getTime() <= new Date(bookClosureDate).getTime();
    };

    return {
        // State Routings
        activeModule, setActiveModule,
        drawerMode, setDrawerMode,
        activeRecord, setActiveRecord,

        // Filters
        searchQuery, setSearchQuery,
        dateRange, setDateRange,
        currentPage, setCurrentPage,
        perPage, setPerPage,

        // Computed Data Engines
        globalJournal,
        accountsWithAging,

        // Utility
        isRecordLocked,
        bookClosureDate,

        // Raw Access
        chartOfAccounts: store.chartOfAccounts,
        costCenters: store.costCenters
    };
}
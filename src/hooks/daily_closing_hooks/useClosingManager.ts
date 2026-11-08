import { useState, useMemo, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGlobalClosingStore } from "@/store/useGlobalClosingStore";
import { ClosingTransaction, TenderMatrix } from "@/types/daily_closing";

export type ClosingTabKey = "hub" | "daily_closings" | "daily_closing_balance" | "profit_loss" | "sale" | "purchase" | "sale_return" | "purchase_return" | "expense" | "withdrawal" | "deposit" | "stock" | "balance_sheet" | "daily_bank";;
export type DrawerMode = "none" | "transaction" | "denomination" | "edit" | "bank_form";;

export function useClosingManager() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const store = useGlobalClosingStore();
    const [drawerMode, setDrawerMode] = useState<DrawerMode>("none"); const [activeRecord, setActiveRecord] = useState<ClosingTransaction | null>(null);
    // --- CONCURRENT ROUTING STATE ---
    const [isPending, startTransition] = useTransition();
    const activeDate = searchParams.get("date") || "2026-11-06";
    const activeTab = (searchParams.get("tab") as ClosingTabKey) || "hub";
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 10;

    const toggleSelection = (id: string | "ALL") => {
        if (id === "ALL") {
            setSelectedIds(selectedIds.length === activeTabData.length ? [] : activeTabData.map(t => t.id));
        } else {
            setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
        }
    };


    const handleRouteChange = (key: "date" | "tab", value: string) => {
        startTransition(() => {
            if (key === "tab") setSelectedIds([]); // Clear table selections when switching spokes

            const params = new URLSearchParams(searchParams.toString());
            params.set(key, value);
            if (key === "date") params.set("tab", "hub");
            router.push(`?${params.toString()}`, { scroll: false });
        });
    };

    const expectedMath = useMemo(() => {
        const expected: TenderMatrix = { cash: 0, bkash: 0, pos: 0 };

        const processArray = (arr: ClosingTransaction[], multiplier: 1 | -1) => {
            arr.filter(t => t.date === activeDate).forEach(t => {
                if (t.paymentMethod === "Cash") expected.cash += (t.paidAmount * multiplier);
                if (t.paymentMethod === "Bkash") expected.bkash += (t.paidAmount * multiplier);
                if (t.paymentMethod === "POS") expected.pos += (t.paidAmount * multiplier);
            });
        };

        // Additions (+)
        processArray(store.sales, 1);
        processArray(store.deposits, 1);

        // Subtractions (-)
        processArray(store.purchases, -1);
        processArray(store.expenses, -1);
        processArray(store.withdrawals, -1);
        processArray(store.salesReturns, -1);

        return expected;
    }, [activeDate, store]);

    // --- DAY STATE & DISCREPANCIES ---
    const dayState = store.closingRecords[activeDate] || {
        status: "open",
        actualTenders: { cash: 0, bkash: 0, pos: 0 },
        denominations: { 1000: 0, 500: 0, 200: 0, 100: 0, 50: 0, 20: 0, 10: 0, 5: 0, 2: 0, 1: 0 }
    };

    const discrepancies = useMemo(() => {
        return {
            cash: dayState.actualTenders.cash - expectedMath.cash,
            bkash: dayState.actualTenders.bkash - expectedMath.bkash,
            pos: dayState.actualTenders.pos - expectedMath.pos,
        };
    }, [expectedMath, dayState.actualTenders]);

    const isLocked = dayState.status === "locked";
    const isSubmitted = dayState.status === "submitted";

    // --- DYNAMIC TAB DATA ENGINE ---
    const activeTabData = useMemo(() => {
        if (activeTab === "daily_closings") return [];
        let data: ClosingTransaction[] = [];
        switch (activeTab) {
            case "sale": data = store.sales; break;
            case "purchase": data = store.purchases; break;
            case "withdrawal": data = store.withdrawals; break;
            case "expense": data = store.expenses; break;
            case "deposit": data = store.deposits; break;
            case "sale_return": data = store.salesReturns; break;
            case "purchase_return": data = store.purchaseReturns; break;
            default: data = [];
        }
        return data.filter(t => t.date === activeDate);
    }, [activeTab, activeDate, store]);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * perPage;
        return activeTabData.slice(start, start + perPage);
    }, [activeTabData, currentPage]);
    return {
        // Core State
        activeDate, activeTab, isPending,
        handleRouteChange,

        // Mathematical & Operational State
        expectedMath,
        dayState,
        discrepancies,
        isLocked,
        isSubmitted,

        // Specific Tab Data
        activeTabData,

        // UI Triggers
        drawerMode, setDrawerMode,
        activeRecord, setActiveRecord,
        selectedIds, toggleSelection, currentPage, setCurrentPage, paginatedData,
        // Direct Store Mutations for the UI
        updateActualTender: store.updateActualTender,
        updateDenomination: store.updateDenomination,
        submitClosing: store.submitClosing,
        approveAndLockClosing: store.approveAndLockClosing,
        unlockClosing: store.unlockClosing
    };
}
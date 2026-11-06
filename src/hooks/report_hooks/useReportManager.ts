import { useState, useMemo, useDeferredValue, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGlobalReportStore } from "@/store/useGlobalReportStore";
import { getReportColumns } from "./reportColumnFactory";

export function useReportManager() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const store = useGlobalReportStore();

    // UI Concurrent Rendering State
    const [isPending, startTransition] = useTransition();

    // Default to "hub" so the user sees the Master Catalog first
    const urlReportType = searchParams.get("type") || "hub";
    const [activeReport, setActiveReport] = useState<string>(urlReportType);

    useEffect(() => {
        if (urlReportType !== activeReport) {
            setActiveReport(urlReportType);
            setCurrentPage(1);
        }
    }, [urlReportType]);

    // Enhanced with startTransition for butter-smooth UI shifting
    const changeReportType = (type: string) => {
        startTransition(() => {
            setActiveReport(type);
        });
        // Update URL quietly in the background
        router.push(type === "hub" ? "/reports" : `?type=${type}`, { scroll: false });
    };

    const [drawerMode, setDrawerMode] = useState<"none" | "detail" | "filter">("none");
    const [activeRecord, setActiveRecord] = useState<any | null>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const deferredSearch = useDeferredValue(searchQuery);
    const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: "", end: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});

    const currentColumns = useMemo(() => getReportColumns(activeReport), [activeReport]);

    const filteredData = useMemo(() => {
        if (activeReport === "hub") return []; // Hub has no table data

        let dataset: any[] = [];
        switch (activeReport) {
            case "stock": dataset = store.stock; break;
            case "profit_loss": dataset = store.profitLoss; break;
            case "sale": dataset = store.sales; break;
            case "sale_return": dataset = store.salesReturn; break;
            case "purchase": dataset = store.purchases; break;
            case "purchase_return": dataset = store.purchaseReturn; break;
            case "stock_transfer": dataset = store.stockTransfer; break;
            case "cash_transfer": dataset = store.cashTransfer; break;
            case "damage": dataset = store.damages; break;
            case "expense": dataset = store.expenses; break;
            case "deposit": dataset = store.deposits; break;
            case "withdrawal": dataset = store.withdrawals; break;
            case "transaction": dataset = store.transactions; break;
            case "daily_bank": dataset = store.dailyBank; break;
            case "total_bank": dataset = store.totalBank; break;
            default: dataset = [];
        }

        return dataset.filter((row) => {
            const matchesSearch = JSON.stringify(row).toLowerCase().includes(deferredSearch.toLowerCase());
            let matchesDate = true;
            if (row.date) {
                const rowDate = new Date(row.date);
                const startValid = !dateRange.start || rowDate >= new Date(dateRange.start);
                const endValid = !dateRange.end || rowDate <= new Date(dateRange.end);
                matchesDate = startValid && endValid;
            }
            return matchesSearch && matchesDate;
        });
    }, [activeReport, store, deferredSearch, dateRange]);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * perPage;
        return filteredData.slice(start, start + perPage);
    }, [filteredData, currentPage, perPage]);

    const aggregates = useMemo(() => {
        const totals: Record<string, number> = {};
        filteredData.forEach(row => {
            currentColumns.forEach(col => {
                if (col.renderType === "currency" || col.id.toLowerCase().includes("item")) {
                    totals[col.id] = (totals[col.id] || 0) + (Number(row[col.id]) || 0);
                }
            });
        });
        return totals;
    }, [filteredData, currentColumns]);

    return {
        activeReport, changeReportType, isPending,
        drawerMode, setDrawerMode, activeRecord, setActiveRecord,
        currentColumns, columnVisibility, setColumnVisibility,
        filteredData, paginatedData, aggregates,
        searchQuery, setSearchQuery, dateRange, setDateRange,
        currentPage, setCurrentPage, perPage, setPerPage,
    };
}
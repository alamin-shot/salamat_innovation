import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useListControls } from "@/hooks/shared_hooks/useTableManager";
import { useLocalListControls } from "@/hooks/shared_hooks/useLocalListControls";
import { useGlobalDirectorsStore } from "@/store/useGlobalDirectorsStore";
import { useDepositStore, Deposit } from "@/hooks/finance_hooks/deposit_hooks/useDepositStore";
import { useWithdrawalStore } from "@/hooks/finance_hooks/withdrawal_hooks/useWithdrawalStore";
import { DirectorSectionKind, DirectorSectionRow } from "@/types/directors";
import { DIRECTOR_SECTIONS } from "@/constants/directors";
import { toTimestamp, toIsoDate } from "@/utils/dateRules";

/** Deposit and Withdrawal records share one shape. */
export type DirectorMoneyRecord = Deposit;

const money = (value: number) => Math.round(value * 100) / 100;
const newestFirst = (a: DirectorMoneyRecord, b: DirectorMoneyRecord) => toTimestamp(toIsoDate(b.date)) - toTimestamp(toIsoDate(a.date));

/** The records of one section (deposits or withdrawals). */
function useSectionRecords(kind: DirectorSectionKind): DirectorMoneyRecord[] {
    const deposits = useDepositStore((state) => state.deposits);
    const withdrawals = useWithdrawalStore((state) => state.withdrawals);
    return kind === "deposit" ? deposits : withdrawals;
}

const matchesDirector = (row: DirectorSectionRow, query: string) => {
    const q = query.toLowerCase();
    return [row.fullName, row.title, row.phone, row.email].some((text) => text.toLowerCase().includes(q));
};

/** Deposit › Director / Withdrawals › Director: every director with this section's count and total. */
export function useDirectorSectionManager(kind: DirectorSectionKind) {
    const router = useRouter();
    const directors = useGlobalDirectorsStore((state) => state.directors);
    const records = useSectionRecords(kind);

    const rows = useMemo<DirectorSectionRow[]>(() => directors.map((director) => {
        const own = records.filter((record) => record.directorId === director.id).sort(newestFirst);
        return {
            ...director,
            recordCount: own.length,
            totalAmount: money(own.reduce((sum, record) => sum + record.amount, 0)),
            lastDate: own[0]?.date ?? null,
        };
    }), [directors, records]);

    const table = useListControls(rows, matchesDirector);
    const grandTotal = money(rows.reduce((sum, row) => sum + row.totalAmount, 0));

    return {
        section: DIRECTOR_SECTIONS[kind],
        table,
        grandTotal,
        openRecords: (id: string) => router.push(`${DIRECTOR_SECTIONS[kind].chooseHref}?director=${id}`),
    };
}

const matchesRecord = (record: DirectorMoneyRecord, query: string) => {
    const q = query.toLowerCase();
    return [record.title, record.shopName, record.contact, record.note, record.date, record.createdBy].some((text) => text.toLowerCase().includes(q));
};

/**
 * Deposit › Choose Director / Withdrawals › Choose Director: pick one director and see only their
 * records. The choice lives in the URL (?director=) so the Director page can link straight to it.
 */
export function useChooseDirectorManager(kind: DirectorSectionKind) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const directors = useGlobalDirectorsStore((state) => state.directors);
    const records = useSectionRecords(kind);

    const requestedId = searchParams.get("director") ?? "";
    const director = directors.find((candidate) => candidate.id === requestedId) ?? null;

    const ownRecords = useMemo(
        () => (director ? records.filter((record) => record.directorId === director.id).sort(newestFirst) : []),
        [records, director]
    );
    const table = useLocalListControls(ownRecords, matchesRecord);

    const chooseDirector = (id: string) => {
        table.setSearchQuery("");
        router.replace(id ? `${pathname}?director=${id}` : pathname);
    };

    return {
        section: DIRECTOR_SECTIONS[kind],
        directorOptions: directors.map((candidate) => ({ value: candidate.id, label: candidate.fullName })),
        director,
        isUnknownDirector: !!requestedId && !director,
        chooseDirector,
        table,
        recordCount: ownRecords.length,
        totalAmount: money(ownRecords.reduce((sum, record) => sum + record.amount, 0)),
        filteredTotal: money(table.filteredData.reduce((sum, record) => sum + record.amount, 0)),
    };
}

export type DirectorSectionManager = ReturnType<typeof useDirectorSectionManager>;
export type ChooseDirectorManager = ReturnType<typeof useChooseDirectorManager>;

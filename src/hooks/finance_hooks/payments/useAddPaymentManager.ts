import { useMemo, useState } from "react";
import { useListControls } from "@/hooks/shared_hooks/useTableManager";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";
import { useRetainedValue } from "@/hooks/products_hooks/useRetainedValue";
import { usePeopleStore } from "@/store/usePeopleStore";
import { usePeopleLedger } from "@/hooks/people_hooks/usePeopleLedger";
import { PaymentPartyRow } from "@/types/payments";
import { PersonType } from "@/types/people";
import { PARTY_TYPE_OPTIONS } from "@/constants/payments";

const matches = (row: PaymentPartyRow, query: string): boolean => {
    const q = query.toLowerCase();
    return [row.name, row.businessName, row.phoneNumber].some((text) => text.toLowerCase().includes(q));
};

const COLUMNS = { name: true, businessName: true, businessLogo: true, phoneNumber: true, debit: true, credit: true, balance: true };

/**
 * Add Payment: every People customer and supplier with their ledger. Receive / Send post Payment
 * records, so the balance here, the profile Lifecycle and the Payment List always agree.
 */
export function useAddPaymentManager() {
    const { activeDrawer, activeId, openView, closeView } = useCommandParams();
    const people = usePeopleStore((state) => state.people);
    const ledger = usePeopleLedger();
    const [typeFilter, setTypeFilterState] = useState<PersonType | "">("");

    const rows = useMemo<PaymentPartyRow[]>(() => people
        .filter((person) => !typeFilter || person.type === typeFilter)
        .map((person) => {
            const summary = ledger.get(person.id);
            const debit = summary?.billed ?? 0;
            const credit = Math.round(((summary?.paid ?? 0) + (summary?.returned ?? 0)) * 100) / 100;
            return {
                id: person.id,
                name: person.name,
                type: person.type,
                businessName: person.businessName,
                businessLogoUrl: person.businessLogoUrl,
                phoneNumber: person.phoneNumber,
                debit,
                credit,
                balance: summary?.currentDue ?? 0,
            };
        }), [people, ledger, typeFilter]);

    const table = useListControls(rows, matches);

    const setTypeFilter = (value: string) => {
        setTypeFilterState(PARTY_TYPE_OPTIONS.find((option) => option.value === value)?.value ?? "");
        table.setCurrentPage(1);
    };

    const isReceiveOpen = activeDrawer === "receive-payment" && !!activeId;
    const isSendOpen = activeDrawer === "send-payment" && !!activeId;
    const isPaymentOpen = isReceiveOpen || isSendOpen;
    const actionId = useRetainedValue(isPaymentOpen ? activeId : null, isPaymentOpen);
    const direction = useRetainedValue<"receive" | "send">(isSendOpen ? "send" : "receive", isPaymentOpen);

    const [cols, setCols] = useState(COLUMNS);
    const toggleColumn = (key: string) => {
        if (key in COLUMNS) setCols((prev) => ({ ...prev, [key]: !prev[key as keyof typeof COLUMNS] }));
    };

    return {
        table,
        cols,
        toggleColumn,
        showAllColumns: () => setCols(COLUMNS),
        typeFilter,
        setTypeFilter,
        clearFilters: () => { setTypeFilter(""); table.setSearchQuery(""); },
        activeRecord: rows.find((row) => row.id === actionId) ?? null,
        isPaymentOpen,
        direction,
        handleReceive: (id: string) => openView("drawer", "receive-payment", id),
        handleSend: (id: string) => openView("drawer", "send-payment", id),
        closeView,
    };
}

export type AddPaymentManagerType = ReturnType<typeof useAddPaymentManager>;

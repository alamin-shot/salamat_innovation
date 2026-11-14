import { useMemo } from "react";
import { usePeopleStore } from "@/store/usePeopleStore";

/**
 * Supplier names for the purchase forms, from People suppliers (Active first is not assumed — all are
 * listed, in store order). A current value that is no longer a supplier stays selectable.
 */
export function useSupplierOptions(current: string): string[] {
    const people = usePeopleStore((state) => state.people);

    return useMemo(() => {
        const names = Array.from(new Set(people.filter((person) => person.type === "Supplier").map((person) => person.name)));
        const value = current.trim();
        return value && !names.includes(value) ? [value, ...names] : names;
    }, [people, current]);
}

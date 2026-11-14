import { useMemo } from "react";
import { usePeopleStore } from "@/store/usePeopleStore";
import { PersonLifecycleSummary } from "@/types/personLifecycle";
import { buildPersonLifecycle } from "@/utils/personLifecycle";
import { useLifecycleSources } from "./useLifecycleSources";

/** Ledger summary (billed, paid, returned, current due) of every People profile, by id. */
export function usePeopleLedger(): Map<string, PersonLifecycleSummary> {
    const people = usePeopleStore((state) => state.people);
    const sources = useLifecycleSources();

    return useMemo(
        () => new Map(people.map((person) => [person.id, buildPersonLifecycle(person, sources).summary])),
        [people, sources]
    );
}

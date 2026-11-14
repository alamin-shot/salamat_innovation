import { useMemo } from "react";
import { usePeopleStore } from "@/store/usePeopleStore";
import { PersonLifecycle } from "@/types/personLifecycle";
import { PersonRecord } from "@/types/people";
import { buildPersonLifecycle } from "@/utils/personLifecycle";
import { useLifecycleSources } from "./useLifecycleSources";

/**
 * One person's chronological journey across the ERP. Recomputes only when the person or one of
 * the source modules changes.
 */
export function usePersonLifecycle(personId: string | null): { person: PersonRecord | null; lifecycle: PersonLifecycle | null } {
    const person = usePeopleStore((state) => state.people.find((record) => record.id === personId) ?? null);
    const sources = useLifecycleSources();

    const lifecycle = useMemo(() => (person ? buildPersonLifecycle(person, sources) : null), [person, sources]);

    return { person, lifecycle };
}

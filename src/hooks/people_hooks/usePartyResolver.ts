import { useCallback } from "react";
import { usePeopleStore } from "@/store/usePeopleStore";
import { PartyReference, PersonKind } from "@/types/people";
import { findPersonForParty } from "@/utils/peopleRules";

/**
 * Turns a party named on a transaction (phone / name / business name) into a People id,
 * so every new transaction stores `personId` instead of relying on text matching later.
 */
export function usePartyResolver(kind: PersonKind) {
    const people = usePeopleStore((state) => state.people);
    return useCallback((party: PartyReference): string | null => findPersonForParty(people, party, kind)?.id ?? null, [people, kind]);
}

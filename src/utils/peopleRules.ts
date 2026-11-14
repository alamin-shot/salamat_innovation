import { CustomerLookup, PartyReference, PersonKind, PersonRecord } from "@/types/people";
import { PERSON_TYPE_KIND } from "@/constants/people";
import { isSamePhone, normalizeBdPhone } from "@/utils/phoneRules";

const sameText = (a: string | null | undefined, b: string | null | undefined): boolean => {
    const left = a?.trim().toLowerCase();
    return !!left && left !== "-" && left !== "—" && left === b?.trim().toLowerCase();
};

/** The person who owns this phone number (primary or secondary), compared in normalised form. */
export function findPersonByPhone(people: PersonRecord[], phone: string, kind?: PersonKind): PersonRecord | null {
    return people.find((person) =>
        (!kind || PERSON_TYPE_KIND[person.type] === kind)
        && (isSamePhone(person.phoneNumber, phone) || (!!person.secondaryPhone && isSamePhone(person.secondaryPhone, phone))),
    ) ?? null;
}

/**
 * Legacy linking for records that only name a party: normalised phone first, then exact
 * (case-insensitive) name, then exact business name. Restricted to customers or suppliers.
 */
export function findPersonForParty(people: PersonRecord[], party: PartyReference, kind: PersonKind): PersonRecord | null {
    if (party.phone && normalizeBdPhone(party.phone)) {
        const byPhone = findPersonByPhone(people, party.phone, kind);
        if (byPhone) return byPhone;
    }
    const ofKind = people.filter((person) => PERSON_TYPE_KIND[person.type] === kind);
    return ofKind.find((person) => sameText(party.name, person.name))
        ?? ofKind.find((person) => sameText(party.businessName ?? party.name, person.businessName))
        ?? null;
}

/** Customer resolution for Order Confirmation: suppliers never match as customers. */
export function lookupCustomer(people: PersonRecord[], rawPhone: string): CustomerLookup {
    if (!rawPhone.trim()) return { status: "empty" };
    const phone = normalizeBdPhone(rawPhone);
    if (!phone) return { status: "invalid" };
    const person = findPersonByPhone(people, phone, "customer");
    if (person) return { status: "matched", person };
    return { status: "not_found", normalizedPhone: phone };
}

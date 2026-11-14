import { create } from "zustand";
import { persist } from "zustand/middleware";
import { NewPersonInput, PeopleState, PersonRecord } from "@/types/people";
import { INITIAL_PEOPLE } from "@/mocks/people.mock";
import { PERSON_ORIGIN_TYPES, PERSON_TYPE_KIND } from "@/constants/people";
import { findPersonByPhone } from "@/utils/peopleRules";
import { normalizeBdPhone } from "@/utils/phoneRules";
import { isIsoTimestamp } from "@/utils/dateRules";
import { supplierInitials } from "@/utils/purchaseMath";

// LAYER 2: People optimistic cache (future /api/people).
// Every creation flow goes through addPerson; the flow's origin sets the (locked) type.

const orDash = (value: string | undefined) => value?.trim() || "-";
/** "—" / "-" are the empty placeholders stored for a missing business name. */
const hasBusinessName = (value: string | undefined) => !!value && !["", "-", "—"].includes(value.trim());

export const usePeopleStore = create<PeopleState>()(
    persist(
        (set, get) => ({
            people: INITIAL_PEOPLE as PersonRecord[],

            addPerson: (input: NewPersonInput) => {
                const name = input.name.trim();
                if (!name) return { ok: false, error: "name_required" };
                const phone = normalizeBdPhone(input.phoneNumber);
                if (!phone) return { ok: false, error: "phone_invalid" };

                const type = PERSON_ORIGIN_TYPES[input.origin];
                if (type === "Supplier" && !hasBusinessName(input.businessName)) return { ok: false, error: "business_required" };
                // One profile per phone per kind; the same person may still have a separate customer and supplier profile.
                const existing = findPersonByPhone(get().people, phone, PERSON_TYPE_KIND[type]);
                if (existing) return { ok: false, error: "phone_exists", existing };

                const person: PersonRecord = {
                    id: `person-${Date.now()}`,
                    initials: supplierInitials(name),
                    name,
                    type,
                    status: "Active",
                    businessName: input.businessName?.trim() || "—",
                    phoneNumber: phone,
                    secondaryPhone: input.secondaryPhone ? normalizeBdPhone(input.secondaryPhone) ?? input.secondaryPhone.trim() : undefined,
                    email: orDash(input.email),
                    address: orDash(input.address),
                    district: orDash(input.district),
                    area: orDash(input.area),
                    rating: "Unrated",
                    note: input.note?.trim() ?? "",
                    priceDocument: "",
                    createdAt: new Date().toISOString(),
                    dateOfBirth: "-",
                    gender: "-",
                    avatarUrl: input.avatarUrl || undefined,
                    businessLogoUrl: input.businessLogoUrl || undefined,
                };
                set((state) => ({ people: [person, ...state.people] }));
                return { ok: true, person };
            },

            addCustomer: (input) => get().addPerson({
                name: input.name,
                phoneNumber: input.phoneNumber,
                address: input.address,
                note: "Added from Order Confirmation",
                origin: input.type === "Online Customer" ? "order_confirmation_online" : "order_confirmation_offline",
            }),

            updatePerson: (id, changes) => {
                const person = get().people.find((record) => record.id === id);
                if (!person) return null;
                if (changes.name !== undefined && !changes.name.trim()) return "name_required";
                if (person.type === "Supplier" && changes.businessName !== undefined && !hasBusinessName(changes.businessName)) return "business_required";
                set((state) => ({
                    people: state.people.map((record) => (record.id === id ? { ...record, ...changes } : record)),
                }));
                return null;
            },

            deletePeople: (ids) => set((state) => ({
                people: state.people.filter((person) => !ids.includes(person.id)),
            })),
        }),
        {
            name: "erp-people-storage-v1",
            // v1: createdAt became ISO-8601 and legacy suppliers / customers were seeded.
            version: 1,
            migrate: (persistedState) => {
                const state = persistedState as PeopleState;
                const saved = state.people ?? [];
                const savedIds = new Set(saved.map((person) => person.id));
                const seededById = new Map(INITIAL_PEOPLE.map((person) => [person.id, person]));
                const upgraded = saved.map((person) => (isIsoTimestamp(person.createdAt)
                    ? person
                    : { ...person, createdAt: seededById.get(person.id)?.createdAt ?? new Date().toISOString() }));
                const added = INITIAL_PEOPLE.filter((person) => !savedIds.has(person.id));
                return { ...state, people: [...upgraded, ...added] };
            },
        }
    )
);

// LAYER 1: People (customers & suppliers). Future NestJS resource: /api/people.

export type PersonType = "Online Customer" | "Offline Customer" | "Supplier";
export type PersonStatus = "Active" | "Inactive";

/** Customers and suppliers are separate profiles; someone who is both has two. */
export type PersonKind = "customer" | "supplier";

export interface PersonRecord {
    id: string;
    initials: string;
    name: string;
    /** Set once at creation from the context that created the person; never edited afterwards. */
    type: PersonType;
    status: PersonStatus;
    businessName: string;
    phoneNumber: string;
    secondaryPhone?: string;
    email: string;
    address: string;
    district: string;
    area: string;
    rating: string;
    note: string;
    priceDocument: string;
    /** ISO-8601. Shown relatively ("2 hours ago") only in the UI. */
    createdAt: string;
    dateOfBirth: string;
    gender: string;
    /** Profile picture (data URL until media storage exists). */
    avatarUrl?: string;
    /** Business logo (data URL until media storage exists). */
    businessLogoUrl?: string;
}

/** Where a person was created; decides their type (never picked by hand). */
export type PersonOrigin =
    | "order_confirmation_online"
    | "order_confirmation_offline"
    | "pos_add_customer"
    | "purchase_add_supplier"
    | "people_add_customer"
    | "people_add_supplier";

/** Fields any creation flow may supply. */
export interface NewPersonInput {
    name: string;
    phoneNumber: string;
    origin: PersonOrigin;
    businessName?: string;
    secondaryPhone?: string;
    email?: string;
    address?: string;
    district?: string;
    area?: string;
    note?: string;
    avatarUrl?: string;
    businessLogoUrl?: string;
}

/** What "Add Customer Directly" (Order Confirmation) supplies. */
export interface NewCustomerInput {
    name: string;
    phoneNumber: string;
    address: string;
    type: Exclude<PersonType, "Supplier">;
}

/** business_required: suppliers must have a business name. */
export type PeopleError = "name_required" | "phone_invalid" | "phone_exists" | "business_required";

export type AddPersonResult = { ok: true; person: PersonRecord } | { ok: false; error: PeopleError; existing?: PersonRecord };
/** @deprecated alias kept for existing imports. */
export type AddCustomerResult = AddPersonResult;

/** Fields the People table and Edit drawer may change. `type` is deliberately absent: it is locked. */
export type PersonEditableFields = Partial<Pick<PersonRecord,
    "status" | "rating" | "note" | "priceDocument" | "name" | "businessName" | "secondaryPhone" | "email" | "address" | "district" | "area" | "avatarUrl" | "businessLogoUrl"
>>;

export interface PeopleState {
    people: PersonRecord[];
    /** Type comes from `origin`. Refuses a phone that already belongs to a profile of the same kind. */
    addPerson: (input: NewPersonInput) => AddPersonResult;
    /** Order Confirmation shortcut (kept for its existing caller). */
    addCustomer: (input: NewCustomerInput) => AddPersonResult;
    /** Returns the validation error, or null when saved. */
    updatePerson: (id: string, changes: PersonEditableFields) => PeopleError | null;
    deletePeople: (ids: string[]) => void;
}

/** Result of looking a phone number up in People. */
export type CustomerLookup =
    | { status: "empty" }
    | { status: "invalid" }
    | { status: "matched"; person: PersonRecord }
    | { status: "not_found"; normalizedPhone: string };

/** How a legacy record names a party: phone first, then exact name / business name. */
export interface PartyReference {
    phone?: string | null;
    name?: string | null;
    businessName?: string | null;
}

import { PeopleError, PersonKind, PersonOrigin, PersonType } from "@/types/people";

/** The creating context decides the type; nobody picks it by hand and it never changes later. */
export const PERSON_ORIGIN_TYPES: Readonly<Record<PersonOrigin, PersonType>> = {
    order_confirmation_online: "Online Customer",
    order_confirmation_offline: "Offline Customer",
    pos_add_customer: "Offline Customer",
    purchase_add_supplier: "Supplier",
    people_add_customer: "Offline Customer",
    people_add_supplier: "Supplier",
};

export const PERSON_TYPE_KIND: Readonly<Record<PersonType, PersonKind>> = {
    "Online Customer": "customer",
    "Offline Customer": "customer",
    Supplier: "supplier",
};

/** Stamped as the creator until the live auth session is wired. */
export const PEOPLE_AUDIT_ACTOR = "Admin";

/** Address pickers on the People form and the Add Supplier modal (until a location API exists). */
export const PEOPLE_COUNTRIES = ["Bangladesh"];
export const PEOPLE_DISTRICTS = ["Dhaka", "Chattogram", "Sylhet", "Rajshahi", "Khulna"];
export const PEOPLE_AREAS = ["Bashundhara", "Dhanmondi", "Gulshan", "Mirpur", "Uttara", "Banani"];

export const PEOPLE_ERROR_MESSAGES: Readonly<Record<PeopleError, string>> = {
    name_required: "Name is required.",
    phone_invalid: "Enter a valid Bangladeshi mobile number (01XXXXXXXXX or +8801XXXXXXXXX).",
    phone_exists: "A profile with this phone number already exists.",
    business_required: "Business name is required for suppliers.",
};

/** Largest edge (px) an uploaded profile picture / logo is scaled to before it is stored. */
export const PEOPLE_IMAGE_MAX_EDGE = 320;
/** Upload limit shown on the form. */
export const PEOPLE_IMAGE_MAX_BYTES = 2 * 1024 * 1024;

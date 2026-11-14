import { useMemo } from "react";
import { toast } from "sonner";
import { usePeopleStore } from "@/store/usePeopleStore";
import { CustomerLookup, PeopleError } from "@/types/people";
import { lookupCustomer } from "@/utils/peopleRules";

const ORDER_CUSTOMER_ERRORS: Record<PeopleError, string> = {
    name_required: "Enter the customer's name.",
    phone_invalid: "Enter a valid Bangladeshi mobile number (01XXXXXXXXX or +8801XXXXXXXXX).",
    phone_exists: "This phone number already belongs to a profile.",
    business_required: "Business name is required for suppliers.",
};

/**
 * Deterministic customer resolution for Order Confirmation, keyed by the normalised phone number.
 * matched   → the profile is linked and its name (and address, when it has one) are locked.
 * not_found → "Add Customer Directly" creates the profile; its type follows the order (Online / Offline).
 */
export function useOrderCustomerResolution(phone: string, channel: "Online" | "Offline") {
    const people = usePeopleStore((state) => state.people);
    const addCustomer = usePeopleStore((state) => state.addCustomer);

    const lookup: CustomerLookup = useMemo(() => lookupCustomer(people, phone), [people, phone]);
    const linkedCustomer = lookup.status === "matched" ? lookup.person : null;
    const hasProfileAddress = !!linkedCustomer && linkedCustomer.address.trim() !== "" && linkedCustomer.address !== "-";

    /** Creates the People profile for an unknown phone; afterwards `lookup` turns into "matched". */
    const addCustomerDirectly = (name: string, address: string): boolean => {
        if (lookup.status !== "not_found") {
            return false;
        }
        const result = addCustomer({
            name,
            phoneNumber: lookup.normalizedPhone,
            address,
            type: channel === "Online" ? "Online Customer" : "Offline Customer",
        });
        if (!result.ok) {
            toast.error(ORDER_CUSTOMER_ERRORS[result.error]);
            return false;
        }
        toast.success(`${result.person.name} added as ${result.person.type}.`);
        return true;
    };

    return {
        lookup,
        linkedCustomer,
        /** Name is locked whenever a profile is linked. */
        isNameLocked: linkedCustomer !== null,
        /** Address is locked only when the profile has one; otherwise the delivery address stays editable. */
        isAddressLocked: hasProfileAddress,
        /** "Add Customer Directly" is shown only for a valid phone with no profile. */
        canAddCustomer: lookup.status === "not_found",
        addCustomerDirectly,
    };
}

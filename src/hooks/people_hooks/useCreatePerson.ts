import { toast } from "sonner";
import { usePeopleStore } from "@/store/usePeopleStore";
import { NewPersonInput, PersonOrigin, PersonRecord } from "@/types/people";
import { PEOPLE_ERROR_MESSAGES, PERSON_ORIGIN_TYPES } from "@/constants/people";


/**
 * Creation entry point for one context (POS, Add Purchase, People page, …). The context fixes the
 * person's type; the form never asks for it. Returns the new person, or null after showing the reason.
 */
export function useCreatePerson(origin: PersonOrigin) {
    const addPerson = usePeopleStore((state) => state.addPerson);

    const create = (input: Omit<NewPersonInput, "origin">): PersonRecord | null => {
        const result = addPerson({ ...input, origin });
        if (!result.ok) {
            toast.error(result.error === "phone_exists" && result.existing
                ? `${PEOPLE_ERROR_MESSAGES.phone_exists} (${result.existing.name})`
                : PEOPLE_ERROR_MESSAGES[result.error]);
            return null;
        }
        toast.success(`${result.person.name} added as ${result.person.type}.`);
        return result.person;
    };

    return { create, type: PERSON_ORIGIN_TYPES[origin] };
}

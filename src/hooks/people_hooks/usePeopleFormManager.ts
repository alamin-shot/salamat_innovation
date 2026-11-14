import { useState } from "react";
import { toast } from "sonner";
import { usePeopleStore } from "@/store/usePeopleStore";
import { PersonOrigin, PersonRecord, PersonType } from "@/types/people";
import { PEOPLE_ERROR_MESSAGES, PEOPLE_IMAGE_MAX_BYTES, PEOPLE_IMAGE_MAX_EDGE, PERSON_ORIGIN_TYPES } from "@/constants/people";
import { ImageReadError, readImageAsDataUrl } from "@/utils/imageFiles";
import { useCreatePerson } from "./useCreatePerson";

/** Create (from a People-page button) or Edit (an existing profile). */
export type PeopleFormMode = { kind: "create"; origin: PersonOrigin } | { kind: "edit"; person: PersonRecord };

const clean = (value: string) => (["", "-", "—"].includes(value.trim()) ? "" : value.trim());

const IMAGE_ERRORS: Record<ImageReadError, string> = {
    not_image: "Please choose an image file.",
    too_large: "Image is larger than 2MB.",
    unreadable: "This image could not be read.",
};

export type PeopleImageField = "avatar" | "logo";

/**
 * People Add / Edit form. The type is never chosen: on create it comes from the button that opened the
 * form; on edit it is shown locked. The phone number is the profile's identity, so it is locked on edit too.
 * Mount with a key per person / origin so each opening starts fresh.
 */
export function usePeopleFormManager(mode: PeopleFormMode, onSaved?: (person: PersonRecord) => void) {
    const updatePerson = usePeopleStore((state) => state.updatePerson);
    const { create } = useCreatePerson(mode.kind === "create" ? mode.origin : "people_add_customer");
    const person = mode.kind === "edit" ? mode.person : null;
    const type: PersonType = person ? person.type : PERSON_ORIGIN_TYPES[mode.kind === "create" ? mode.origin : "people_add_customer"];

    const [name, setName] = useState(person?.name ?? "");
    const [businessName, setBusinessName] = useState(clean(person?.businessName ?? ""));
    const [phone, setPhone] = useState(person?.phoneNumber ?? "");
    const [secondaryPhone, setSecondaryPhone] = useState(person?.secondaryPhone ?? "");
    const [email, setEmail] = useState(clean(person?.email ?? ""));

    // Stored on the profile as avatarUrl / businessLogoUrl (scaled data URLs until media storage exists).
    const [profilePicture, setProfilePicture] = useState<string | null>(person?.avatarUrl ?? null);
    const [businessLogo, setBusinessLogo] = useState<string | null>(person?.businessLogoUrl ?? null);

    const handleImageUpload = (field: PeopleImageField, file: File | undefined) => {
        if (!file) return;
        readImageAsDataUrl(file, PEOPLE_IMAGE_MAX_EDGE, PEOPLE_IMAGE_MAX_BYTES)
            .then((dataUrl) => (field === "avatar" ? setProfilePicture(dataUrl) : setBusinessLogo(dataUrl)))
            .catch((code: ImageReadError) => toast.error(IMAGE_ERRORS[code] ?? IMAGE_ERRORS.unreadable));
    };

    const [country, setCountry] = useState("");
    const [district, setDistrict] = useState(clean(person?.district ?? ""));
    const [area, setArea] = useState(clean(person?.area ?? ""));
    const [thana, setThana] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [streetAddress, setStreetAddress] = useState(clean(person?.address ?? ""));

    /** Street, thana and postal code are stored together as the address line. */
    const composedAddress = [streetAddress, thana, postalCode].map((part) => part.trim()).filter(Boolean).join(", ");

    const handleSave = () => {
        if (!name.trim()) return toast.error(PEOPLE_ERROR_MESSAGES.name_required);

        if (person) {
            const error = updatePerson(person.id, {
                name: name.trim(),
                businessName: businessName.trim() || "—",
                secondaryPhone: secondaryPhone.trim() || undefined,
                email: email.trim() || "-",
                address: composedAddress || "-",
                district: district || "-",
                area: area || "-",
                avatarUrl: profilePicture ?? undefined,
                businessLogoUrl: businessLogo ?? undefined,
            });
            if (error) return toast.error(PEOPLE_ERROR_MESSAGES[error]);
            toast.success(`${name.trim()} updated.`);
            onSaved?.(person);
            return;
        }

        const created = create({
            name, phoneNumber: phone, businessName, secondaryPhone, email, address: composedAddress, district, area,
            avatarUrl: profilePicture ?? undefined, businessLogoUrl: businessLogo ?? undefined,
        });
        if (created) onSaved?.(created);
    };

    return {
        isEdit: !!person,
        type,
        /** Suppliers must have a business name. */
        isBusinessRequired: type === "Supplier",
        name, setName,
        businessName, setBusinessName,
        phone, setPhone,
        secondaryPhone, setSecondaryPhone,
        email, setEmail,
        profilePicture, setProfilePicture,
        businessLogo, setBusinessLogo,
        handleImageUpload,
        country, setCountry,
        district, setDistrict,
        area, setArea,
        thana, setThana,
        postalCode, setPostalCode,
        streetAddress, setStreetAddress,
        handleSave,
    };
}

export type PeopleFormManager = ReturnType<typeof usePeopleFormManager>;

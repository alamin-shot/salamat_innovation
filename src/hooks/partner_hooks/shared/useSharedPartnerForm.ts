import { useState } from "react";
import { toast } from "sonner";
import { usePartnerStore } from "@/store/usePartnerStore";
import { Partner, PartnerStatus, PartnerTier, PartnerType } from "@/types/partners";
import { PARTNER_TIERS, PARTNER_TYPE_LABELS } from "@/constants/partners";
import { PEOPLE_IMAGE_MAX_BYTES, PEOPLE_IMAGE_MAX_EDGE } from "@/constants/people";
import { ImageReadError, readImageAsDataUrl } from "@/utils/imageFiles";

const IMAGE_ERRORS: Record<ImageReadError, string> = {
    not_image: "Please choose an image file.",
    too_large: "File size must be under 2MB",
    unreadable: "This image could not be read.",
};

/** Add / Edit partner. Mount with a key per record so each opening starts from that record. */
export function useSharedPartnerForm(partnerType: PartnerType, initialRecord: Partner | null, onClose: () => void) {
    const addPartner = usePartnerStore((state) => state.addPartner);
    const updatePartner = usePartnerStore((state) => state.updatePartner);
    const isApplication = partnerType === "application";
    const statusOptions: PartnerStatus[] = isApplication ? ["Pending", "Rejected"] : ["Active", "Inactive"];

    const [name, setName] = useState(initialRecord?.name ?? "");
    const [email, setEmail] = useState(initialRecord && initialRecord.email !== "-" ? initialRecord.email : "");
    const [primaryPhone, setPrimaryPhone] = useState(initialRecord?.primaryPhone ?? "");
    const [secondaryPhone, setSecondaryPhone] = useState(initialRecord && initialRecord.secondaryPhone !== "-" ? initialRecord.secondaryPhone : "");
    const [businessName, setBusinessName] = useState(initialRecord?.businessName ?? "");
    const [tradeLicense, setTradeLicense] = useState(initialRecord && initialRecord.tradeLicense !== "-" ? initialRecord.tradeLicense : "");
    const [address, setAddress] = useState(initialRecord && initialRecord.address !== "-" ? initialRecord.address : "");
    const [tier, setTierState] = useState<PartnerTier>(initialRecord?.tier ?? "Standard");
    const [status, setStatusState] = useState<PartnerStatus>(initialRecord?.status ?? statusOptions[0]);
    const [logoUrl, setLogoUrl] = useState<string | null>(initialRecord?.logoUrl ?? null);

    const handleLogo = (file: File | undefined) => {
        if (!file) return;
        readImageAsDataUrl(file, PEOPLE_IMAGE_MAX_EDGE, PEOPLE_IMAGE_MAX_BYTES)
            .then(setLogoUrl)
            .catch((code: ImageReadError) => toast.error(IMAGE_ERRORS[code] ?? IMAGE_ERRORS.unreadable));
    };

    const handleSave = () => {
        if (!name.trim() || !primaryPhone.trim() || !businessName.trim()) {
            return toast.error("Name, Primary Phone, Business Name, and Status are required.");
        }
        const payload = {
            type: partnerType, tier, name: name.trim(), email: email.trim() || "-", primaryPhone: primaryPhone.trim(),
            secondaryPhone: secondaryPhone.trim() || "-", businessName: businessName.trim(),
            tradeLicense: tradeLicense.trim() || "-", address: address.trim() || "-", status, logoUrl,
        };
        const label = PARTNER_TYPE_LABELS[partnerType].one;
        if (initialRecord) {
            updatePartner(initialRecord.id, payload);
            toast.success(`${label} updated successfully!`);
        } else {
            addPartner(payload);
            toast.success(`${label} added successfully!`);
        }
        onClose();
    };

    return {
        isApplication,
        name, setName, email, setEmail, primaryPhone, setPrimaryPhone,
        secondaryPhone, setSecondaryPhone, businessName, setBusinessName,
        tradeLicense, setTradeLicense, address, setAddress,
        tier, tierOptions: PARTNER_TIERS, setTier: (value: string) => setTierState(PARTNER_TIERS.find((option) => option === value) ?? tier),
        status, statusOptions, setStatus: (value: string) => setStatusState(statusOptions.find((option) => option === value) ?? status),
        logoUrl, handleLogo, clearLogo: () => setLogoUrl(null),
        handleSave,
    };
}

export type SharedPartnerForm = ReturnType<typeof useSharedPartnerForm>;

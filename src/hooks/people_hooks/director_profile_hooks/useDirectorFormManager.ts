import { useState } from "react";
import { toast } from "sonner";
import { useGlobalDirectorsStore } from "@/store/useGlobalDirectorsStore";
import { DirectorProfile } from "@/types/directors";
import { DIRECTOR_ERRORS } from "@/constants/directors";
import { PEOPLE_IMAGE_MAX_BYTES, PEOPLE_IMAGE_MAX_EDGE } from "@/constants/people";
import { ImageReadError, readImageAsDataUrl } from "@/utils/imageFiles";

const IMAGE_ERRORS: Record<ImageReadError, string> = {
    not_image: "Please choose an image file.",
    too_large: "Image is larger than 2MB.",
    unreadable: "This image could not be read.",
};

/**
 * Create Directors page and Edit Profile drawer. On edit the password field starts empty and is only
 * changed when something is typed. Mount with a key per director so each opening starts fresh.
 */
export function useDirectorFormManager(existing: DirectorProfile | null, onSaved: (director: DirectorProfile) => void) {
    const addDirector = useGlobalDirectorsStore((state) => state.addDirector);
    const updateDirector = useGlobalDirectorsStore((state) => state.updateDirector);

    const [fullName, setFullName] = useState(existing?.fullName ?? "");
    const [title, setTitle] = useState(existing?.title ?? "");
    const [email, setEmail] = useState(existing?.email ?? "");
    const [phone, setPhone] = useState(existing?.phone ?? "");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(existing?.avatarUrl ?? null);

    const handlePhotoUpload = (file: File | undefined) => {
        if (!file) return;
        readImageAsDataUrl(file, PEOPLE_IMAGE_MAX_EDGE, PEOPLE_IMAGE_MAX_BYTES)
            .then(setAvatarUrl)
            .catch((code: ImageReadError) => toast.error(IMAGE_ERRORS[code] ?? IMAGE_ERRORS.unreadable));
    };

    const handleSave = () => {
        const input = { fullName, title, email, phone, password, avatarUrl: avatarUrl ?? undefined };
        const result = existing ? updateDirector(existing.id, input) : addDirector(input);
        if (!result.ok) return toast.error(DIRECTOR_ERRORS[result.error]);
        toast.success(existing ? "Director profile updated." : `${result.director.fullName} added as a director.`);
        onSaved(result.director);
    };

    return {
        isEdit: !!existing,
        fullName, setFullName,
        title, setTitle,
        email, setEmail,
        phone, setPhone,
        password, setPassword,
        showPassword, togglePasswordVisibility: () => setShowPassword((prev) => !prev),
        avatarUrl, handlePhotoUpload,
        handleSave,
    };
}

export type DirectorFormManager = ReturnType<typeof useDirectorFormManager>;

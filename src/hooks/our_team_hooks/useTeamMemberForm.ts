import { useState } from "react";
import { toast } from "sonner";
import { useOurTeamStore } from "@/store/useOurTeamStore";
import { TeamMember, TeamMemberStatus } from "@/types/ourTeam";
import { TEAM_ERRORS } from "@/constants/ourTeam";
import { PEOPLE_IMAGE_MAX_BYTES, PEOPLE_IMAGE_MAX_EDGE } from "@/constants/people";
import { ImageReadError, readImageAsDataUrl } from "@/utils/imageFiles";

const IMAGE_ERRORS: Record<ImageReadError, string> = {
    not_image: "Please choose an image file.",
    too_large: "Image is larger than 2MB.",
    unreadable: "This image could not be read.",
};

/** Add / Edit team member. Mount with a key per member so each opening starts from that record. */
export function useTeamMemberForm(existing: TeamMember | null, onSaved: () => void) {
    const addMember = useOurTeamStore((state) => state.addMember);
    const updateMember = useOurTeamStore((state) => state.updateMember);

    const [name, setName] = useState(existing?.name ?? "");
    const [designation, setDesignation] = useState(existing?.designation ?? "");
    const [description, setDescription] = useState(existing?.description ?? "");
    const [status, setStatus] = useState<TeamMemberStatus>(existing?.status ?? "Active");
    const [photoUrl, setPhotoUrl] = useState<string | null>(existing?.photoUrl ?? null);

    const handlePhoto = (file: File | undefined) => {
        if (!file) return;
        readImageAsDataUrl(file, PEOPLE_IMAGE_MAX_EDGE, PEOPLE_IMAGE_MAX_BYTES)
            .then(setPhotoUrl)
            .catch((code: ImageReadError) => toast.error(IMAGE_ERRORS[code] ?? IMAGE_ERRORS.unreadable));
    };

    const handleSave = () => {
        const input = { name, designation, description, status, photoUrl: photoUrl ?? undefined };
        const result = existing ? updateMember(existing.id, input) : addMember(input);
        if (!result.ok) return toast.error(TEAM_ERRORS[result.error]);
        toast.success(existing ? `${result.member.name} updated.` : `${result.member.name} added to the team.`);
        onSaved();
    };

    return {
        isEdit: !!existing,
        name, setName,
        designation, setDesignation,
        description, setDescription,
        status, setStatus: (value: string) => setStatus(value === "Inactive" ? "Inactive" : "Active"),
        photoUrl, handlePhoto, clearPhoto: () => setPhotoUrl(null),
        handleSave,
    };
}

export type TeamMemberForm = ReturnType<typeof useTeamMemberForm>;

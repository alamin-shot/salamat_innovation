import { MediaFileType, SessionRole } from "@/types/media";

export const SESSION_ROLES: SessionRole[] = ["Super Admin", "Manager", "Editor"];

export const MEDIA_TYPE_LABELS: Readonly<Record<MediaFileType, string>> = {
    image: "Images",
    pdf: "PDFs",
    video: "Videos",
};

export const MEDIA_PIN_LENGTH = 4;

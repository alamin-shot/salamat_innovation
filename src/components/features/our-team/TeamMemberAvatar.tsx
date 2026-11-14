import Image from "next/image";
import { ImageIcon } from "lucide-react";

/** Team member photo, or a neutral placeholder. */
export function TeamMemberAvatar({ name, photoUrl, size }: { name: string; photoUrl?: string; size: "sm" | "lg" }) {
    const box = size === "lg" ? "h-24 w-24 rounded-2xl" : "h-10 w-10 rounded";
    return (
        <div className={`relative flex shrink-0 items-center justify-center overflow-hidden bg-gray-100 ${box}`}>
            {photoUrl ? <Image src={photoUrl} alt={name} fill unoptimized className="object-cover" /> : <ImageIcon className={size === "lg" ? "h-8 w-8 text-gray-300" : "h-5 w-5 text-gray-300"} />}
        </div>
    );
}

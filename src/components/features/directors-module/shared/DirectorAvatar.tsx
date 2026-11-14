import Image from "next/image";

const initials = (name: string) => name.split(/\s+/).filter(Boolean).map((part) => part[0]).join("").substring(0, 2).toUpperCase();

/** Director photo, or initials when no photo was uploaded. */
export function DirectorAvatar({ name, avatarUrl, size }: { name: string; avatarUrl?: string; size: "sm" | "md" | "lg" }) {
    const box = size === "lg" ? "h-20 w-20 text-2xl" : size === "md" ? "h-16 w-16 text-xl" : "h-8 w-8 text-xs";
    return (
        <div className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-800 font-bold text-white shadow-md ${box}`}>
            {avatarUrl ? <Image src={avatarUrl} alt={name} fill unoptimized className="object-cover" /> : initials(name)}
        </div>
    );
}

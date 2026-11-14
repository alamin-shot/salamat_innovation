import Image from "next/image";
import { Crown } from "lucide-react";
import { PartnerStatus, PartnerTier } from "@/types/partners";
import { PARTNER_TIER_STYLES } from "@/constants/partners";

export function PartnerTierBadge({ tier }: { tier: PartnerTier }) {
    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${PARTNER_TIER_STYLES[tier]}`}>
            {tier !== "Standard" && <Crown className="h-3 w-3" />}
            {tier}
        </span>
    );
}

export function PartnerLogo({ name, logoUrl, size = "sm" }: { name: string; logoUrl: string | null; size?: "sm" | "lg" }) {
    const box = size === "lg" ? "h-20 w-20 rounded-2xl text-2xl" : "h-9 w-9 rounded-lg text-xs";
    const initials = name.split(/\s+/).filter(Boolean).map((part) => part[0]).join("").substring(0, 2).toUpperCase();
    return (
        <div className={`relative flex shrink-0 items-center justify-center overflow-hidden bg-emerald-800 font-bold text-white ${box}`}>
            {logoUrl ? <Image src={logoUrl} alt={`${name} logo`} fill unoptimized className="bg-white object-contain" /> : initials}
        </div>
    );
}

const STATUS_STYLES: Record<PartnerStatus, string> = {
    Active: "bg-emerald-50 text-emerald-700",
    Inactive: "bg-gray-100 text-gray-600",
    Pending: "bg-amber-50 text-amber-700",
    Rejected: "bg-rose-50 text-rose-600",
};

export function PartnerStatusBadge({ status }: { status: PartnerStatus }) {
    return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${STATUS_STYLES[status]}`}>{status}</span>;
}

/** Active / Inactive switch for partner rows. */
export function PartnerStatusSwitch({ isActive, onToggle, label }: { isActive: boolean; onToggle: () => void; label: string }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={isActive}
            aria-label={label}
            onClick={onToggle}
            className="inline-flex items-center gap-2"
        >
            <span className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors ${isActive ? "bg-emerald-500" : "bg-gray-300"}`}>
                <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${isActive ? "translate-x-4" : "translate-x-0.5"}`} />
            </span>
            <span className={`text-xs font-semibold ${isActive ? "text-emerald-700" : "text-gray-500"}`}>{isActive ? "Active" : "Inactive"}</span>
        </button>
    );
}

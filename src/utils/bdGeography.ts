export interface AreaMetadata {
    area: string;
    thana: string;
    postalCode: string;
}

export const BD_COUNTRIES = ["Bangladesh", "India", "United Arab Emirates"];

export const BD_DISTRICTS: Record<string, string[]> = {
    Bangladesh: ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna"],
    India: ["Kolkata", "Mumbai", "Delhi"],
    "United Arab Emirates": ["Dubai", "Abu Dhabi"]
};

export const BD_AREAS_BY_DISTRICT: Record<string, AreaMetadata[]> = {
    Dhaka: [
        { area: "Bhatara (Jamuna Future Park)", thana: "Vatara", postalCode: "1229" },
        { area: "Bashundhara R/A", thana: "Vatara", postalCode: "1229" },
        { area: "Gulshan-1", thana: "Gulshan", postalCode: "1212" },
        { area: "Gulshan-2", thana: "Gulshan", postalCode: "1212" },
        { area: "Banani", thana: "Banani", postalCode: "1213" },
        { area: "Uttara Sector 7", thana: "Uttara", postalCode: "1230" },
        { area: "Mirpur-10", thana: "Mirpur", postalCode: "1216" },
        { area: "Dhanmondi", thana: "Dhanmondi", postalCode: "1209" },
        { area: "Motijheel", thana: "Motijheel", postalCode: "1000" }
    ],
    Chittagong: [
        { area: "Agrabad", thana: "Double Mooring", postalCode: "4100" },
        { area: "GEC Circle", thana: "Panchlaish", postalCode: "4203" },
        { area: "Nasirabad", thana: "Khulshi", postalCode: "4209" }
    ],
    Sylhet: [
        { area: "Zindabazar", thana: "Kotwali", postalCode: "3100" },
        { area: "Amberkhana", thana: "Airport", postalCode: "3100" }
    ],
    Rajshahi: [
        { area: "Shaheb Bazar", thana: "Boalia", postalCode: "6100" }
    ],
    Khulna: [
        { area: "Shib Bari", thana: "Sonadanga", postalCode: "9100" }
    ]
};

export function resolveAreaDetails(district: string, areaName: string): { thana: string; postalCode: string } {
    const list = BD_AREAS_BY_DISTRICT[district] || [];
    const found = list.find((item) => item.area === areaName);
    return found ? { thana: found.thana, postalCode: found.postalCode } : { thana: "", postalCode: "" };
}

export function getInitials(fullName: string): string {
    if (!fullName) return "EM";
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
}

const AVATAR_PALETTE = [
    "bg-indigo-600 text-white",
    "bg-blue-600 text-white",
    "bg-emerald-600 text-white",
    "bg-violet-600 text-white",
    "bg-amber-600 text-white",
    "bg-rose-600 text-white"
];

export function getAvatarColorClass(idOrName: string): string {
    let hash = 0;
    for (let i = 0; i < idOrName.length; i++) {
        hash = idOrName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}
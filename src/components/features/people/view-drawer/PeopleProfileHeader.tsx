import Image from "next/image";
import { Phone } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { PersonRecord } from "@/types/people";
import { PersonLifecycle } from "@/types/personLifecycle";

const EMPTY_SUMMARY = { billed: 0, paid: 0, returned: 0, currentDue: 0 };
const money = (value: number) => `৳${Math.abs(value).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export function PeopleProfileHeader({ person, lifecycle }: { person: PersonRecord; lifecycle: PersonLifecycle | null }) {
    const summary = lifecycle?.summary ?? EMPTY_SUMMARY;
    const isSupplier = person.type === "Supplier";

    return (
        <div className="flex flex-col gap-5">
            {/* Top Profile Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xl font-bold text-white shadow-md">
                        {person.avatarUrl ? <Image src={person.avatarUrl} alt={person.name} fill unoptimized className="rounded-full object-cover" /> : person.initials}
                        <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h2 className="text-lg font-bold text-gray-900">{person.name}</h2>
                        <span className="text-xs text-gray-500">{person.email}</span>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="rounded-full bg-amber-100/80 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
                                {person.type}
                            </span>
                            <Badge variant={person.status === "Active" ? "success" : "destructive"}>
                                {person.status}
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50/60 px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-sm">
                    <Phone className="h-3.5 w-3.5 text-indigo-600" />
                    <span>{person.phoneNumber}</span>
                </div>
            </div>

            {/* Ledger summary (from the lifecycle): billed, paid, returned, running due. */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 border-t-4 border-t-indigo-600 bg-white p-5 shadow-sm">
                    <span className="text-2xl font-extrabold text-indigo-600">{money(summary.billed)}</span>
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mt-1">
                        {isSupplier ? "Total Purchased" : "Total Billed"}
                    </span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 border-t-4 border-t-emerald-500 bg-white p-5 shadow-sm">
                    <span className="text-2xl font-extrabold text-emerald-500">{money(summary.paid)}</span>
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mt-1">
                        {isSupplier ? "Paid To Supplier" : "Total Paid"}
                    </span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 border-t-4 border-t-amber-500 bg-white p-5 shadow-sm">
                    <span className="text-2xl font-extrabold text-amber-500">{money(summary.returned)}</span>
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mt-1">
                        {"Returned"}
                    </span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 border-t-4 border-t-rose-500 bg-white p-5 shadow-sm">
                    <span className="text-2xl font-extrabold text-rose-500">{money(summary.currentDue)}</span>
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mt-1">
                        {summary.currentDue < 0 ? "Advance" : "Current Due"}
                    </span>
                </div>
            </div>
        </div>
    );
}
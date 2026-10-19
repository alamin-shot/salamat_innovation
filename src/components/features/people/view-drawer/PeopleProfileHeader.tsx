import { Phone } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export function PeopleProfileHeader({ person }: { person: any }) {
    return (
        <div className="flex flex-col gap-5">
            {/* Top Profile Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xl font-bold text-white shadow-md">
                        {person.initials}
                        <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h2 className="text-lg font-bold text-gray-900">{person.name}</h2>
                        <span className="text-xs text-gray-500">{person.email}</span>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="rounded-full bg-amber-100/80 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
                                Other
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

            {/* 4 Colored Top-Border KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 border-t-4 border-t-indigo-600 bg-white p-5 shadow-sm">
                    <span className="text-2xl font-extrabold text-indigo-600">0</span>
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mt-1">
                        Total Orders
                    </span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 border-t-4 border-t-amber-500 bg-white p-5 shadow-sm">
                    <span className="text-2xl font-extrabold text-amber-500">0</span>
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mt-1">
                        Pending
                    </span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 border-t-4 border-t-emerald-500 bg-white p-5 shadow-sm">
                    <span className="text-2xl font-extrabold text-emerald-500">0</span>
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mt-1">
                        Delivered
                    </span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 border-t-4 border-t-red-500 bg-white p-5 shadow-sm">
                    <span className="text-2xl font-extrabold text-red-500">0</span>
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mt-1">
                        Rejected
                    </span>
                </div>
            </div>
        </div>
    );
}
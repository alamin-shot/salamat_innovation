import { Drawer } from "@/components/ui/Drawer";
import { Badge } from "@/components/ui/Badge";

export function ViewOrderOptionDrawer({
    id,
    record,
    isOpen,
    onClose,
}: {
    id: string | null;
    record: any;
    isOpen: boolean;
    onClose: () => void;
}) {
    const data = record || {
        type: "Advance Media",
        name: "Bkash 24",
        color: "Pink",
        sortOrder: 0,
        status: "Active",
    };

    if (!id && !isOpen) return null;

    const getBadgeColorStyle = (color: string) => {
        if (color === "Pink") return "bg-pink-100/70 text-pink-700 border-pink-200";
        if (color === "Green") return "bg-emerald-100/70 text-emerald-700 border-emerald-200";
        if (color === "Yellow") return "bg-amber-100/70 text-amber-700 border-amber-200";
        if (color === "Red") return "bg-red-100/70 text-red-700 border-red-200";
        if (color === "Blue") return "bg-sky-100/70 text-sky-700 border-sky-200";
        return "bg-gray-100 text-gray-700 border-gray-200";
    };

    return (
        <Drawer title="Order Option Details" isOpen={isOpen} onClose={onClose} width="w-full max-w-none lg:w-[calc(100vw-280px)]">
            <div className="p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-full pb-12">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-gray-100 pb-5">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-400">Type</span>
                            <span className="text-sm font-medium text-gray-800">{data.type}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-400">Name</span>
                            <div>
                                <span className={`inline-flex rounded px-2.5 py-0.5 text-xs font-semibold border ${getBadgeColorStyle(data.color)}`}>
                                    {data.name}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-400">Sort Order</span>
                            <span className="text-sm font-medium text-gray-800">{data.sortOrder}</span>
                        </div>
                        <div className="flex flex-col gap-1 items-start">
                            <span className="text-xs font-semibold text-gray-400">Status</span>
                            <Badge variant={data.status === "Active" ? "success" : "destructive"}>{data.status}</Badge>
                        </div>
                    </div>
                </div>
            </div>
        </Drawer>
    );
}
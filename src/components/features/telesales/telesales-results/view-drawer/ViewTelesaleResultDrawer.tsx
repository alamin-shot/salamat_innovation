import { Drawer } from "@/components/ui/Drawer";
import { Badge } from "@/components/ui/Badge";

export function ViewTelesaleResultDrawer({
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
        name: "Sale Done",
        color: "Green",
        sortOrder: 1,
        status: "Active",
    };

    if (!id && !isOpen) return null;

    return (
        <Drawer
            title="Telesale Result Details"
            isOpen={isOpen}
            onClose={onClose}
            width="w-full max-w-none lg:w-[calc(100vw-280px)]"
        >
            <div className="p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-full pb-12">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-gray-100 pb-5">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-400">Name</span>
                            <div>
                                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-0.5 text-xs font-semibold text-emerald-700">
                                    {data.name}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-400">Color</span>
                            <span className="text-sm font-medium text-gray-800">{data.color}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-400">Sort Order</span>
                            <span className="text-sm font-medium text-gray-800">{data.sortOrder}</span>
                        </div>
                        <div className="flex flex-col gap-1 items-start">
                            <span className="text-xs font-semibold text-gray-400">Status</span>
                            <Badge variant={data.status === "Active" ? "success" : "destructive"}>
                                {data.status}
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>
        </Drawer>
    );
}
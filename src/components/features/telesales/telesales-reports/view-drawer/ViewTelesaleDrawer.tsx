import { Drawer } from "@/components/ui/Drawer";
import { Badge } from "@/components/ui/Badge";

export function ViewTelesaleDrawer({
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
        id: id || "1",
        date: "16 Oct 2026",
        customerType: "New",
        customer: "Jobayer",
        customerNumber: "01727866876",
        address: "-",
        customerDemand: "Pixel 7",
        media: "Messenger",
        result: "Shop Visit",
        salesmanName: "Jannat Ull Naeem Sarah",
        note: "Pujar chuti te ashbe. Pixel 7 (u) niben",
    };

    if (!id && !isOpen) return null;

    return (
        <Drawer
            title="Telesale Details"
            isOpen={isOpen}
            onClose={onClose}
            width="w-full max-w-none lg:w-[calc(100vw-280px)]"
        >
            <div className="p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-full pb-12">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
                    {/* Row 1: Date & Customer Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-gray-100 pb-5">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-400">Date</span>
                            <span className="text-sm font-medium text-gray-800">{data.date}</span>
                        </div>
                        <div className="flex flex-col gap-1 items-start">
                            <span className="text-xs font-semibold text-gray-400">Customer Type</span>
                            <Badge variant="success">{data.customerType}</Badge>
                        </div>
                    </div>

                    {/* Row 2: Customer & Customer Number */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-gray-100 pb-5">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-400">Customer</span>
                            <span className="text-sm font-medium text-gray-800">{data.customer}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-400">Customer Number</span>
                            <span className="text-sm font-medium text-gray-800">{data.customerNumber}</span>
                        </div>
                    </div>

                    {/* Row 3: Address */}
                    <div className="flex flex-col gap-1 border-b border-gray-100 pb-5">
                        <span className="text-xs font-semibold text-gray-400">Address</span>
                        <span className="text-sm text-gray-700">{data.address || "-"}</span>
                    </div>

                    {/* Row 4: Customer Demand & Media */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-gray-100 pb-5">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-400">Customer Demand</span>
                            <span className="text-sm font-medium text-gray-800">{data.customerDemand}</span>
                        </div>
                        <div className="flex flex-col gap-1 items-start">
                            <span className="text-xs font-semibold text-gray-400">Media</span>
                            <Badge variant="success">{data.media}</Badge>
                        </div>
                    </div>

                    {/* Row 5: Result & Salesman Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-gray-100 pb-5">
                        <div className="flex flex-col gap-1 items-start">
                            <span className="text-xs font-semibold text-gray-400">Result</span>
                            <Badge variant={data.result === "Shop Visit" ? "success" : "default"}>
                                {data.result}
                            </Badge>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-400">Salesman Name</span>
                            <span className="text-sm font-medium text-gray-800">{data.salesmanName}</span>
                        </div>
                    </div>

                    {/* Row 6: Note */}
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-gray-400">Note</span>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            {data.note || "-"}
                        </p>
                    </div>
                </div>
            </div>
        </Drawer>
    );
}
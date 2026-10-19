import { Drawer } from "@/components/ui/Drawer";

export function ViewOrderDrawer({
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
        date: "18 Oct 2026",
        confirmationDate: "18 Oct 2026",
        customer: "Pronoy Roy",
        customerPhone: "01715232149",
        address: "Bochagonj,Dinajpur",
        orderMedia: "WhatsApp",
        onlineOffline: "Offline",
        orderPerson: "Jannat Ull Naeem Sarah",
        product: "Haylou Solar 5",
        advanceMedia: "Bkash 22",
        advanceAmount: 120.0,
        sellingPrice: 6449.0,
        cod: 6449.0,
        note: "-",
        deliveryStatus: "-",
        invoiceNo: "-",
        deliveryBy: "-",
        track: "-",
        deliveryNote: "-",
    };

    if (!id && !isOpen) return null;

    return (
        <Drawer
            title="Order Details"
            isOpen={isOpen}
            onClose={onClose}
            width="w-full max-w-none lg:w-[calc(100vw-280px)]"
        >
            <div className="p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-full pb-12">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
                    {/* Row 1: Dates */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-gray-100 pb-5">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-400">Date</span>
                            <span className="text-sm font-medium text-gray-800">{data.date}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-400">Confirmation Date</span>
                            <span className="text-sm font-medium text-gray-800">{data.confirmationDate}</span>
                        </div>
                    </div>

                    {/* Row 2: Customer Name & Mobile */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-gray-100 pb-5">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-400">Name</span>
                            <span className="text-sm font-medium text-gray-800">{data.customer}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-400">Mobile</span>
                            <span className="text-sm font-medium text-gray-800">{data.customerPhone}</span>
                        </div>
                    </div>

                    {/* Row 3: Address */}
                    <div className="flex flex-col gap-1 border-b border-gray-100 pb-5">
                        <span className="text-xs font-semibold text-gray-400">Address</span>
                        <span className="text-sm text-gray-700">{data.address}</span>
                    </div>

                    {/* Row 4: Order Media & Online/Offline */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-gray-100 pb-5">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-400">Order Media</span>
                            <div>
                                <span className="inline-flex rounded bg-sky-100/75 px-2 py-0.5 text-xs font-semibold text-sky-700">
                                    {data.orderMedia}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-400">Online / Offline</span>
                            <div>
                                <span
                                    className={`inline-flex rounded px-2 py-0.5 text-xs font-semibold ${data.onlineOffline === "Online"
                                        ? "bg-emerald-100/75 text-emerald-700"
                                        : "bg-red-100/75 text-red-700"
                                        }`}
                                >
                                    {data.onlineOffline}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Row 5: Order Person */}
                    <div className="flex flex-col gap-1 border-b border-gray-100 pb-5">
                        <span className="text-xs font-semibold text-gray-400">Order Person</span>
                        <span className="text-sm font-medium text-gray-800">{data.orderPerson}</span>
                    </div>

                    {/* Products Table Breakdown */}
                    <div className="flex flex-col gap-2 border-b border-gray-100 pb-5">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Products</span>
                        <div className="rounded-lg border border-gray-200 overflow-hidden">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                                    <tr>
                                        <th className="p-3 font-semibold">Product</th>
                                        <th className="p-3 font-semibold">Quantity</th>
                                        <th className="p-3 font-semibold">Unit Price</th>
                                        <th className="p-3 font-semibold text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-gray-700">
                                    <tr>
                                        <td className="p-3 font-medium text-gray-800">{data.product}</td>
                                        <td className="p-3">1</td>
                                        <td className="p-3">{data.sellingPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                                        <td className="p-3 text-right font-medium">{data.sellingPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Row 6: Advance Media, Advance Amount, Selling Price */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-b border-gray-100 pb-5">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-400">Advance Media</span>
                            <div>
                                {data.advanceMedia !== "-" ? (
                                    <span className="inline-flex rounded bg-pink-100/75 px-2 py-0.5 text-xs font-semibold text-pink-700">
                                        {data.advanceMedia}
                                    </span>
                                ) : (
                                    <span className="text-sm text-gray-500">—</span>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-400">Advance Amount</span>
                            <span className="text-sm font-medium text-gray-800">
                                {Number(data.advanceAmount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-400">Selling Price</span>
                            <span className="text-sm font-medium text-gray-800">
                                {Number(data.sellingPrice).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>

                    {/* Row 7: COD & Note */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-gray-100 pb-5">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-400">COD</span>
                            <span className="text-sm font-bold text-gray-900">
                                {Number(data.cod).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-400">Note</span>
                            <span className="text-sm text-gray-700">{data.note}</span>
                        </div>
                    </div>

                    {/* Row 8: Delivery Section (Delivery Status, Invoice No, Delivery By, Track, Delivery Note) */}
                    <div className="flex flex-col gap-4 pt-2">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Delivery Information</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-semibold text-gray-400">Delivery Status</span>
                                <span className="text-sm font-medium text-gray-800">{data.deliveryStatus}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-semibold text-gray-400">Invoice No</span>
                                <span className="text-sm font-medium text-gray-800">{data.invoiceNo}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-semibold text-gray-400">Delivery By</span>
                                <span className="text-sm font-medium text-gray-800">{data.deliveryBy}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-semibold text-gray-400">Track</span>
                                <span className="text-sm text-emerald-600 underline truncate">{data.track}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-semibold text-gray-400">Delivery Note</span>
                                <span className="text-sm text-gray-700">{data.deliveryNote || "-"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Drawer>
    );
}
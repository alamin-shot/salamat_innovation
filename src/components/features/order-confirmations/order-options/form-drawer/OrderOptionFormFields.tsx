import { CustomSelect } from "@/components/ui/CustomSelect";

export function OrderOptionFormFields({ manager }: { manager: any }) {
    const typeOptions = ["Advance Media", "Order Media", "Delivery Status", "Delivery By", "Online / Offline"];
    const colorOptions = ["Grey", "Pink", "Green", "Yellow", "Red", "Blue"];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-gray-600">
                    Type <span className="text-red-500">*</span>
                </label>
                <CustomSelect value={manager.type} onChange={manager.setType} options={typeOptions} placeholder="Select type" />
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-gray-600">
                    Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    placeholder="Name"
                    value={manager.name}
                    onChange={(e) => manager.setName(e.target.value)}
                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-700 focus:border-emerald-500 focus:outline-none h-9"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Color</label>
                    <CustomSelect value={manager.color} onChange={manager.setColor} options={colorOptions} placeholder="Select color" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Sort Order</label>
                    <input
                        type="number"
                        value={manager.sortOrder}
                        onChange={(e) => manager.setSortOrder(Number(e.target.value))}
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-700 focus:border-emerald-500 focus:outline-none h-9"
                    />
                </div>
            </div>

            <div>
                <label className="inline-flex items-center gap-2 cursor-pointer text-[13px] font-medium text-gray-700">
                    <input type="checkbox" checked={manager.isActive} onChange={(e) => manager.setIsActive(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                    <span>Active</span>
                </label>
            </div>
        </div>
    );
}
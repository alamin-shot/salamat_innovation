import { CustomSelect } from "@/components/ui/CustomSelect";

export function TelesalesFormFields({
    manager,
    mode,
}: {
    manager: any;
    mode: "create" | "edit";
}) {
    const customerOptions = [
        "Jobayer (01727866876)",
        "Md rajaul jomadder (01714862329)",
        "Lima akhter (01304235119)",
        "Badhon (01752431688)",
        "Rakib (01340969652)",
    ];
    const productOptions = [
        "Pixel 7",
        "iPhone 17 Pro Max",
        "CMF Phone 2 Pro",
        "Anker Zolo 20w Adapter",
        "Oppo Reno 7A",
        "Redmi Note 14 5G",
        "IQOO Z10 Turbo Pro",
    ];
    const mediaOptions = ["Messenger", "WhatsApp", "Phone Call"];
    const resultOptions = ["Shop Visit", "Follow Up", "Waiting"];
    const salesmanOptions = ["Jannat Ull Naeem Sarah", "Alamin Rifat", "Md Zihadul Islam Sazzad"];

    return (
        <div className="flex flex-col gap-6">
            {/* Checkbox 1: Customer is not in our system (enter manually) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
                <div className="hidden md:block" />
                <div className="md:col-span-2">
                    <label className="inline-flex items-center gap-2 cursor-pointer text-[13px] font-medium text-gray-700">
                        <input
                            type="checkbox"
                            checked={manager.isManualCustomer}
                            onChange={(e) => manager.setIsManualCustomer(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>Customer is not in our system (enter manually)</span>
                    </label>
                </div>
            </div>

            {/* Row 1: Dynamic Customer Selection vs Manual Customer Number + Name */}
            {!manager.isManualCustomer ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-gray-600">
                            Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            value={manager.date}
                            onChange={(e) => manager.setDate(e.target.value)}
                            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-700 focus:border-emerald-500 focus:outline-none h-9"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-[13px] font-medium text-gray-600">
                            Customer <span className="text-red-500">*</span>
                        </label>
                        <CustomSelect
                            value={manager.selectedCustomer}
                            onChange={manager.setSelectedCustomer}
                            options={customerOptions}
                            placeholder="Choose a Customer"
                        />
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-gray-600">
                            Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            value={manager.date}
                            onChange={(e) => manager.setDate(e.target.value)}
                            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-700 focus:border-emerald-500 focus:outline-none h-9"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-gray-600">
                            Customer Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Customer Number"
                            value={manager.manualCustomerNumber}
                            onChange={(e) => manager.setManualCustomerNumber(e.target.value)}
                            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-700 focus:border-emerald-500 focus:outline-none h-9"
                        />
                        {(mode === "edit" || manager.manualCustomerNumber) && (
                            <span className="inline-flex w-fit rounded bg-emerald-100/80 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 mt-0.5">
                                New Customer
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-gray-600">Customer</label>
                        <input
                            type="text"
                            placeholder="Customer"
                            value={manager.manualCustomerName}
                            onChange={(e) => manager.setManualCustomerName(e.target.value)}
                            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-700 focus:border-emerald-500 focus:outline-none h-9"
                        />
                    </div>
                </div>
            )}

            {/* Checkbox 2: Product is not in our catalogue (type it manually) */}
            <div>
                <label className="inline-flex items-center gap-2 cursor-pointer text-[13px] font-medium text-gray-700">
                    <input
                        type="checkbox"
                        checked={manager.isManualProduct}
                        onChange={(e) => manager.setIsManualProduct(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Product is not in our catalogue (type it manually)</span>
                </label>
            </div>

            {/* Row 2: Customer Demand & Media */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Customer Demand</label>
                    {manager.isManualProduct ? (
                        <input
                            type="text"
                            placeholder="Type product name..."
                            value={manager.customerDemand}
                            onChange={(e) => manager.setCustomerDemand(e.target.value)}
                            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-700 focus:border-emerald-500 focus:outline-none h-9"
                        />
                    ) : (
                        <CustomSelect
                            value={manager.customerDemand}
                            onChange={manager.setCustomerDemand}
                            options={productOptions}
                            placeholder="Choose a product"
                        />
                    )}
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Media</label>
                    <CustomSelect
                        value={manager.media}
                        onChange={manager.setMedia}
                        options={mediaOptions}
                        placeholder="Choose media"
                    />
                </div>
            </div>

            {/* Row 3: Result & Salesman Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Result</label>
                    <CustomSelect
                        value={manager.result}
                        onChange={manager.setResult}
                        options={resultOptions}
                        placeholder="Choose a result"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Salesman Name</label>
                    <CustomSelect
                        value={manager.salesmanName}
                        onChange={manager.setSalesmanName}
                        options={salesmanOptions}
                        placeholder="Choose a salesman"
                    />
                </div>
            </div>

            {/* Row 4: Address & Note */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Address</label>
                    <textarea
                        rows={3}
                        placeholder="Address"
                        value={manager.address}
                        onChange={(e) => manager.setAddress(e.target.value)}
                        className="w-full rounded-md border border-gray-200 bg-white p-3 text-[13px] text-gray-700 focus:border-emerald-500 focus:outline-none resize-none"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Note</label>
                    <textarea
                        rows={3}
                        placeholder="Note"
                        value={manager.note}
                        onChange={(e) => manager.setNote(e.target.value)}
                        className="w-full rounded-md border border-gray-200 bg-white p-3 text-[13px] text-gray-700 focus:border-emerald-500 focus:outline-none resize-none"
                    />
                </div>
            </div>
        </div>
    );
}
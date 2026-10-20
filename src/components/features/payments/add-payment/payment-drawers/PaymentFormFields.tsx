import { CustomSelect } from "@/components/ui/CustomSelect";
import { PaymentEntity } from "@/hooks/finance_hooks/payments/useAddPaymentStore";

export function PaymentFormFields({
    manager,
    record,
    bannerType,
}: {
    manager: any;
    record: PaymentEntity | null;
    bannerType: "Customer" | "Supplier";
}) {
    if (!record) return null;

    const formatCurrency = (amount: number) => `৳ ${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

    return (
        <div className="flex flex-col gap-6">
            <div className="rounded-lg bg-cyan-50/80 p-4 border border-cyan-100 flex flex-col gap-1">
                <div className="text-[13px] text-cyan-800 font-medium">
                    {bannerType}: <span className="font-semibold">{record.name}</span>
                </div>
                <div className="text-[13px] text-cyan-800 font-medium">
                    Current Due: <span className="font-semibold">{formatCurrency(record.balance)}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                        Payment Method <span className="text-red-500">*</span>
                    </label>
                    <CustomSelect
                        value={manager.paymentMethod}
                        onChange={manager.setPaymentMethod}
                        options={["Cash", "Bkash", "Nagad", "Bank Transfer"]}
                        placeholder="Choose a payment method"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-gray-600">
                    Paying Amount <span className="text-red-500">*</span>
                </label>
                <input
                    type="number"
                    placeholder="Paying Amount"
                    value={manager.amount}
                    onChange={(e) => manager.setAmount(e.target.value)}
                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-700 focus:border-emerald-500 focus:outline-none h-9"
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-gray-600">Note</label>
                <textarea
                    rows={3}
                    placeholder="Note"
                    value={manager.note}
                    onChange={(e) => manager.setNote(e.target.value)}
                    className="w-full rounded-md border border-gray-200 bg-white p-2.5 text-[13px] text-gray-700 focus:border-emerald-500 focus:outline-none resize-none"
                />
            </div>
        </div>
    );
}
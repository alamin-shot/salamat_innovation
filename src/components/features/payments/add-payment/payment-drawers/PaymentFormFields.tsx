import { CustomSelect } from "@/components/ui/CustomSelect";
import { PaymentFormManager } from "@/hooks/finance_hooks/payments/usePaymentFormManager";
import { PaymentPartyRow } from "@/types/payments";
import { PAYMENT_METHODS } from "@/constants/payments";

const money = (amount: number) => `৳ ${Math.abs(amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const INPUT = "h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none";

export function PaymentFormFields({ manager, record }: { manager: PaymentFormManager; record: PaymentPartyRow }) {
    const role = record.type === "Supplier" ? "Supplier" : "Customer";

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1 rounded-lg border border-cyan-100 bg-cyan-50/80 p-4">
                <div className="text-sm font-medium text-cyan-800">
                    {role}: <span className="font-semibold">{record.name}</span>
                </div>
                <div className="text-sm font-medium text-cyan-800">
                    {record.balance < 0 ? "Advance" : "Current Due"}: <span className="text-lg font-bold tabular-nums">{money(record.balance)}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-600">Date <span className="text-red-500">*</span></label>
                    <input type="date" value={manager.date} onChange={(e) => manager.setDate(e.target.value)} className={INPUT} />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-600">Payment Method <span className="text-red-500">*</span></label>
                    <CustomSelect value={manager.paymentMethod} onChange={manager.setPaymentMethod} options={[...PAYMENT_METHODS]} placeholder="Choose a payment method" />
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-600">Paying Amount <span className="text-red-500">*</span></label>
                <input type="number" min="0" placeholder="Paying Amount" value={manager.amount} onChange={(e) => manager.setAmount(e.target.value)} className={`${INPUT} text-base font-semibold tabular-nums`} />
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-600">Note</label>
                <textarea rows={3} placeholder="Note" value={manager.note} onChange={(e) => manager.setNote(e.target.value)} className="w-full resize-none rounded-md border border-gray-200 bg-white p-2.5 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none" />
            </div>
        </div>
    );
}

import * as React from "react";
import { Lock, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { useGlobalSalesStore } from "@/store/useGlobalSalesStore";
import { SalePayment, SaleRow } from "@/types/sales";
import { useSalePayments } from "@/hooks/sales_hooks/useSalePayments";
import { PAYMENT_ERRORS } from "@/constants/payments";
import { SALE_PAYMENT_METHODS, SALE_SELLERS } from "@/constants/sales";
import { computeSaleTotals } from "@/utils/salesMath";

const INPUT = "w-full rounded border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-700 focus:outline-none focus:border-emerald-500";
const money = (value: number) => `৳ ${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/**
 * Edit Sale: seller, address and payments only (e.g. a later instalment). Customer and items stay as sold,
 * so the customer's ledger and any returns stay consistent. Mount with `key={sale.id}`.
 */
export function EditSaleForm({ sale, onDone }: { sale: SaleRow; onDone: () => void }) {
    const updateSaleDetails = useGlobalSalesStore((state) => state.updateSaleDetails);
    const postPayments = useSalePayments();
    const [seller, setSeller] = React.useState(sale.seller);
    const [address, setAddress] = React.useState(sale.address);
    const [payments, setPayments] = React.useState<SalePayment[]>(sale.payments);

    const totals = computeSaleTotals({ ...sale, payments });
    const sellers = SALE_SELLERS.some((name) => name === seller) ? [...SALE_SELLERS] : [seller, ...SALE_SELLERS];

    const setPayment = (id: string, changes: Partial<SalePayment>) => setPayments((prev) => prev.map((payment) => (payment.id === id ? { ...payment, ...changes } : payment)));

    const save = () => {
        if (payments.some((payment) => payment.amount > 0 && !payment.method)) {
            toast.error("Choose a method for every payment.");
            return;
        }
        if (payments.some((payment) => !Number.isFinite(payment.amount) || payment.amount < 0)) {
            toast.error(PAYMENT_ERRORS.amount_invalid);
            return;
        }
        // Payments are Payment records: re-posting replaces this invoice's set (new rows are dated now).
        const paymentError = postPayments(sale, payments, new Date().toISOString());
        if (paymentError) {
            toast.error(PAYMENT_ERRORS[paymentError]);
            return;
        }
        updateSaleDetails(sale.id, { seller, address: address.trim() });
        toast.success(`Sale ${sale.invoiceNumber} updated.`);
        onDone();
    };

    return (
        <div className="flex flex-col gap-6 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/70 px-4 py-3 text-[13px] text-gray-600">
                <Lock className="h-4 w-4 text-gray-400" />
                <span><b className="text-gray-800">{sale.invoiceNumber}</b> · {sale.customerName} · {sale.items.length} item(s) · {money(totals.grandTotal)}</span>
                <span className="text-[11px] text-gray-500">Customer and items are locked after the sale.</span>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] text-gray-500">Seller</label>
                    <CustomSelect value={seller} onChange={setSeller} options={sellers} placeholder="Choose a Seller" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] text-gray-500">Address</label>
                    <input value={address} onChange={(e) => setAddress(e.target.value)} className={INPUT} />
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <label className="text-[13px] font-medium text-blue-500">Payments received</label>
                {payments.map((payment) => (
                    <div key={payment.id} className="grid grid-cols-[1fr_1fr_auto] gap-3">
                        <input type="number" min="0" value={payment.amount || ""} placeholder="0" onChange={(e) => setPayment(payment.id, { amount: Number(e.target.value) || 0 })} className={INPUT} />
                        <CustomSelect value={payment.method} onChange={(method) => setPayment(payment.id, { method })} options={[...SALE_PAYMENT_METHODS]} placeholder="Choose a payment method" />
                        <Button size="icon-sm" variant="destructive-ghost" onClick={() => setPayments((prev) => prev.filter((item) => item.id !== payment.id))} title="Remove payment"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                ))}
                <div>
                    <Button variant="success" onClick={() => setPayments((prev) => [...prev, { id: crypto.randomUUID(), method: "", amount: 0 }])} className="h-8 gap-1 px-3 text-[12px]"><Plus className="h-3.5 w-3.5" /> Add Payment</Button>
                </div>
                <div className="grid grid-cols-2 gap-3 rounded-lg bg-blue-50/40 p-3 text-[13px] font-medium text-blue-600">
                    <span>Total received: {money(totals.received)}</span>
                    <span className="text-right">Due: {money(totals.due)}</span>
                </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <Button variant="outline" onClick={onDone} className="px-6">Cancel</Button>
                <Button variant="success" onClick={save} className="gap-2 px-8"><Save className="h-4 w-4" /> Save</Button>
            </div>
        </div>
    );
}

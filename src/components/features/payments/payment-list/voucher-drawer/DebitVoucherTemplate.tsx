import { PaymentLog } from "@/hooks/finance_hooks/payments/usePaymentListStore";

export function DebitVoucherTemplate({ record }: { record: PaymentLog }) {
    return (
        <div className="bg-white p-8 md:p-12 shadow-sm rounded-lg border border-gray-100 max-w-3xl mx-auto font-sans text-gray-800">
            <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
                <div className="flex flex-col gap-1">
                    <h1 className="text-4xl font-black tracking-tighter text-emerald-600">TEKZO</h1>
                    <div className="mt-4 text-[13px] leading-relaxed text-gray-600">
                        <p><span className="font-semibold text-gray-800">Company Name :</span> {record.businessName !== "-" ? record.businessName : record.contact}</p>
                        <p><span className="font-semibold text-gray-800">Account Name :</span> {record.contact}</p>
                        <p><span className="font-semibold text-gray-800">Phone :</span> 01642082924</p>
                        <p><span className="font-semibold text-gray-800">Email :</span> -</p>
                        <p><span className="font-semibold text-gray-800">Address :</span> JFP</p>
                    </div>
                </div>
                <div className="text-right flex flex-col gap-1">
                    <h2 className="text-2xl font-light tracking-widest text-gray-800 uppercase">Debit Voucher</h2>
                    <p className="text-[13px] text-gray-600 mt-2">Date : {record.date}</p>
                    <p className="text-[13px] text-gray-600">Voucher No : <span className="font-medium text-gray-900">{record.invoiceNumber}</span></p>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-6">
                <div className="col-span-3 flex flex-col gap-4">
                    <div className="grid grid-cols-[130px_1fr] text-[13px]">
                        <span className="font-semibold text-gray-700">Paid to</span>
                        <span className="text-gray-900">: {record.contact}</span>
                    </div>
                    <div className="grid grid-cols-[130px_1fr] text-[13px]">
                        <span className="font-semibold text-gray-700">Purpose</span>
                        <span className="text-gray-900">: -</span>
                    </div>
                    <div className="grid grid-cols-[130px_1fr] text-[13px]">
                        <span className="font-semibold text-gray-700">Amount In Word</span>
                        <span className="text-gray-900">: Thirteen Thousand Taka Only</span>
                    </div>
                </div>
                <div className="col-span-1 flex flex-col justify-center items-center bg-gray-50 border border-gray-100 rounded-lg p-4">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Amount</span>
                    <span className="text-lg font-bold text-gray-900">
                        {record.debit > 0 ? record.debit.toLocaleString("en-US", { minimumFractionDigits: 2 }) : record.credit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                </div>
            </div>

            <div className="mt-12 bg-gray-100 rounded-lg p-4 flex justify-between items-center text-[13px]">
                <span className="text-gray-700">Payment Method (Cash) : BDT {record.debit > 0 ? record.debit.toLocaleString("en-US") : record.credit.toLocaleString("en-US")}</span>
                <span className="font-bold text-gray-900">
                    Total: <span className="ml-2">BDT {record.debit > 0 ? record.debit.toLocaleString("en-US", { minimumFractionDigits: 2 }) : record.credit.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                </span>
            </div>
        </div>
    );
}
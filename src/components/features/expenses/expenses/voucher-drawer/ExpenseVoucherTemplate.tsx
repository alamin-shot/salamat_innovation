import { ExpenseItem } from "@/hooks/finance_hooks/expenses/useExpensesStore";
import Image from "next/image";

export function ExpenseVoucherTemplate({ record }: { record: ExpenseItem }) {
    return (
        <div className="bg-white p-8 md:p-12 shadow-sm rounded-lg border border-gray-100 max-w-3xl mx-auto font-sans text-gray-800">
            <div className="flex justify-between items-start border-b-2 border-amber-500 pb-6 mb-6">
                <div className="flex flex-col gap-4">
                    {/* Requires /tekzologo.png in public folder */}
                    <div className="relative h-14">
                        <Image src="/tekzologo.png" width={100} height={50} alt="TEKZO" className="object-cover object-left" />
                    </div>
                    <div className="text-[13px] leading-relaxed text-gray-700 mt-2">
                        <p><span className="font-semibold text-gray-900">Shop :</span> {record.shopName.replace("TEKZO ", "")}</p>
                        <p><span className="font-semibold text-gray-900">Category :</span> {record.category}</p>
                        <p><span className="font-semibold text-gray-900">Created By :</span> {record.createdBy}</p>
                    </div>
                </div>
                <div className="text-right flex flex-col gap-1">
                    <h2 className="text-2xl font-normal tracking-wide text-gray-900 uppercase">Expense Voucher</h2>
                    <p className="text-[13px] text-gray-600 mt-2">Date : {record.date}</p>
                    <p className="text-[13px] text-gray-600">Voucher No : <span className="font-medium text-gray-900">{record.invoiceNumber}</span></p>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-6">
                <div className="col-span-3 flex flex-col gap-4 bg-gray-50 rounded-lg p-5">
                    <div className="grid grid-cols-[130px_1fr] text-[13px]">
                        <span className="font-semibold text-gray-700">Title</span>
                        <span className="text-gray-900">: {record.title}</span>
                    </div>
                    <div className="grid grid-cols-[130px_1fr] text-[13px]">
                        <span className="font-semibold text-gray-700">Payment Method</span>
                        <span className="text-gray-900">: {record.paymentMethod}</span>
                    </div>
                    <div className="grid grid-cols-[130px_1fr] text-[13px]">
                        <span className="font-semibold text-gray-700">Note</span>
                        <span className="text-gray-900">: {record.note}</span>
                    </div>
                </div>
                <div className="col-span-1 flex flex-col justify-center items-center bg-gray-50 rounded-lg p-4">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Amount</span>
                    <span className="text-lg font-bold text-gray-900">৳ {record.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                </div>
            </div>

            <div className="mt-6 bg-gray-200/60 rounded-lg p-4 flex justify-between items-center text-[13px]">
                <span className="text-gray-700">Paid via {record.paymentMethod} : ৳ {record.amount.toLocaleString("en-US")}</span>
                <span className="font-bold text-gray-900 text-lg">
                    Total: ৳ {record.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
            </div>

            <div className="mt-20 flex justify-between px-8 text-[13px] font-medium text-gray-600">
                <div className="border-t border-gray-400 pt-2 w-40 text-center">Prepared By</div>
                <div className="border-t border-gray-400 pt-2 w-40 text-center">Approved By</div>
            </div>
            <div className="mt-8 text-center text-xs italic text-gray-400">Thank You!</div>
        </div>
    );
}
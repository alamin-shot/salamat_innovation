import * as React from "react";
import { PaymentListRow } from "@/types/payments";
import { PersonRecord } from "@/types/people";
import { takaInWords } from "@/utils/amountInWords";
import { formatDay } from "@/utils/dateDisplay";

const money = (amount: number) => amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const orDash = (value: string | undefined | null) => (value && !["-", "—"].includes(value.trim()) ? value : "-");

/** Debit voucher (money sent) or credit voucher (money received) for one Payment record. */
export function DebitVoucherTemplate({ record, party, ref }: { record: PaymentListRow; party: PersonRecord | null; ref?: React.Ref<HTMLDivElement> }) {
    const isReceived = record.type === "payment received";
    const company = orDash(record.businessName) !== "-" ? record.businessName : record.contact;

    return (
        <div ref={ref} className="mx-auto max-w-3xl rounded-lg border border-gray-100 bg-white p-8 font-sans text-gray-800 shadow-sm md:p-12 print:border-0 print:shadow-none">
            <div className="mb-8 flex items-start justify-between border-b border-gray-200 pb-8">
                <div className="flex flex-col gap-1">
                    <h1 className="text-4xl font-black tracking-tighter text-emerald-600">TEKZO</h1>
                    <div className="mt-4 text-sm leading-relaxed text-gray-600">
                        <p><span className="font-semibold text-gray-800">Company Name :</span> {company}</p>
                        <p><span className="font-semibold text-gray-800">Account Name :</span> {record.contact}</p>
                        <p><span className="font-semibold text-gray-800">Phone :</span> {orDash(party?.phoneNumber ?? record.contactPhone)}</p>
                        <p><span className="font-semibold text-gray-800">Email :</span> {orDash(party?.email)}</p>
                        <p><span className="font-semibold text-gray-800">Address :</span> {orDash(party?.address)}</p>
                    </div>
                </div>
                <div className="flex flex-col gap-1 text-right">
                    <h2 className="text-2xl font-light uppercase tracking-widest text-gray-800">{isReceived ? "Credit Voucher" : "Debit Voucher"}</h2>
                    <p className="mt-2 text-sm text-gray-600">Date : {formatDay(record.date)}</p>
                    <p className="text-sm text-gray-600">Voucher No : <span className="font-semibold text-gray-900">{record.number}</span></p>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
                <div className="col-span-3 flex flex-col gap-4">
                    <div className="grid grid-cols-[150px_1fr] text-sm">
                        <span className="font-semibold text-gray-700">{isReceived ? "Received from" : "Paid to"}</span>
                        <span className="text-gray-900">: {record.contact}</span>
                    </div>
                    <div className="grid grid-cols-[150px_1fr] text-sm">
                        <span className="font-semibold text-gray-700">Purpose</span>
                        <span className="text-gray-900">: {record.invoiceRef ? `Against ${record.invoiceRef}` : orDash(record.note) !== "-" ? record.note : "On account"}</span>
                    </div>
                    <div className="grid grid-cols-[150px_1fr] text-sm">
                        <span className="font-semibold text-gray-700">Amount In Word</span>
                        <span className="text-gray-900">: {takaInWords(record.amount)}</span>
                    </div>
                </div>
                <div className="col-span-1 flex flex-col items-center justify-center rounded-lg border border-gray-100 bg-gray-50 p-4">
                    <span className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Amount</span>
                    <span className="text-xl font-bold tabular-nums text-gray-900">{money(record.amount)}</span>
                </div>
            </div>

            <div className="mt-12 flex items-center justify-between rounded-lg bg-gray-100 p-4 text-sm">
                <span className="text-gray-700">Payment Method ({orDash(record.method) === "-" ? "Not recorded" : record.method}) : BDT {money(record.amount)}</span>
                <span className="text-base font-bold text-gray-900">Total: <span className="ml-2 tabular-nums">BDT {money(record.amount)}</span></span>
            </div>
        </div>
    );
}

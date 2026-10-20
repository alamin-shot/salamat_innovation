import { ExpenseItem } from "@/hooks/finance_hooks/expenses/useExpensesStore";

export function ExpenseReportTemplate({ data }: { data: ExpenseItem[] }) {
    const grandTotal = data.reduce((sum, item) => sum + item.amount, 0);
    const currentDate = new Date().toLocaleString("en-GB", { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(',', '');

    return (
        <div className="bg-white p-8 md:p-12 shadow-sm rounded-lg border border-gray-100 max-w-4xl mx-auto font-sans text-gray-800">
            <div className="flex justify-between items-end border-b-4 border-amber-500 pb-4 mb-6">
                <h1 className="text-3xl font-bold text-emerald-600 tracking-tight">A-Block</h1>
                <div className="text-right flex flex-col gap-1">
                    <h2 className="text-2xl font-normal tracking-wide text-gray-800 uppercase">Expense Report</h2>
                    <p className="text-[13px] font-bold text-gray-800">A-Block</p>
                    <p className="text-[11px] text-gray-600">Date : <span className="bg-amber-500 text-white px-1.5 py-0.5 rounded">{currentDate}</span></p>
                    <p className="text-[11px] text-gray-600">Phone : -</p>
                </div>
            </div>

            <table className="w-full text-left text-[11px] mb-8">
                <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="p-2.5 font-bold w-8">#</th>
                        <th className="p-2.5 font-bold w-24">Date</th>
                        <th className="p-2.5 font-bold">Title</th>
                        <th className="p-2.5 font-bold">Category</th>
                        <th className="p-2.5 font-bold">Note</th>
                        <th className="p-2.5 font-bold text-right w-24">Amount</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {data.map((item, index) => (
                        <tr key={item.id} className="text-gray-600">
                            <td className="p-2.5">{index + 1}</td>
                            <td className="p-2.5">{item.date}</td>
                            <td className="p-2.5 font-medium text-gray-800">{item.title}</td>
                            <td className="p-2.5">{item.category}</td>
                            <td className="p-2.5 text-gray-400">{item.note !== "-" ? item.note : "-"}</td>
                            <td className="p-2.5 text-right">{item.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="bg-gray-200/60 rounded-lg p-6 flex justify-between items-center text-[13px]">
                <div className="bg-white rounded p-4 w-64 min-h-[80px] border border-gray-100">
                    <span className="text-gray-500 font-semibold text-xs">Note :</span>
                </div>
                <div className="flex flex-col gap-2 text-right">
                    <span className="text-gray-600 border-b border-gray-300 pb-1">Grand Total</span>
                    <div className="flex items-center justify-end gap-6">
                        <span className="text-gray-600">Total Amount</span>
                        <span className="font-bold text-gray-900">: BDT {grandTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
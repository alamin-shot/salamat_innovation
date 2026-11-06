"use client";
import { forwardRef } from "react";
import { useReportManager } from "@/hooks/report_hooks/useReportManager";

interface PrintableReportProps {
    manager: ReturnType<typeof useReportManager>;
}

export const PrintableReport = forwardRef<HTMLDivElement, PrintableReportProps>(({ manager }, ref) => {
    const { activeReport, filteredData, currentColumns, aggregates, columnVisibility } = manager;

    // Filter columns for print: Keep it if it's visible OR if it's strictly required for compliance
    const printColumns = currentColumns.filter(col =>
        col.isAlwaysPrinted || columnVisibility[col.id] !== false
    );

    return (
        <div className="hidden">
            {/* STRICT PHYSICAL DIMENSIONS & CSS RESET FOR PRINT */}
            <div ref={ref} className="bg-white p-8" style={{ width: '210mm', minHeight: '297mm', color: '#000' }}>

                {/* Letterhead */}
                <div className="flex justify-between items-start border-b-2 border-gray-900 pb-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-wider text-gray-900">Salamat Innovation</h1>
                        <p className="text-sm font-bold text-gray-600 mt-1 capitalize">{activeReport.replace("_", " ")} Master Report</p>
                    </div>
                    <div className="text-right text-xs text-gray-600 flex flex-col gap-0.5">
                        <p>Date Printed: {new Date().toLocaleDateString()}</p>
                        <p>Total Records: {filteredData.length}</p>
                        <p>System Generated Report</p>
                    </div>
                </div>

                {/* Master Report Table */}
                <table className="w-full text-left border-collapse text-xs">
                    <thead>
                        <tr className="bg-gray-100 text-gray-900 uppercase tracking-wider text-[9px] font-bold">
                            {printColumns.map(col => (
                                <th key={`print-th-${col.id}`} className={`p-2 border border-gray-300 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}>
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length === 0 ? (
                            <tr>
                                <td colSpan={printColumns.length} className="p-4 text-center text-gray-500 border border-gray-300">
                                    No data available for this report.
                                </td>
                            </tr>
                        ) : (
                            filteredData.map((row, idx) => (
                                <tr key={row.id || idx} className="text-gray-800">
                                    {printColumns.map(col => {
                                        const val = row[col.id];
                                        return (
                                            <td key={`print-td-${col.id}`} className={`p-2 border border-gray-300 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.renderType === 'currency' ? 'font-mono' : ''}`}>
                                                {col.renderType === "currency" ? `৳${Number(val || 0).toLocaleString()}` :
                                                    col.renderType === "date" ? new Date(val).toLocaleDateString() :
                                                        col.renderType === "badge" ? String(val).replace("_", " ") :
                                                            (val || "-")}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        )}
                    </tbody>

                    {/* Aggregate Footer for Print */}
                    {filteredData.length > 0 && (
                        <tfoot>
                            <tr className="bg-gray-50 font-black uppercase text-[10px] text-gray-900">
                                {printColumns.map((col, idx) => {
                                    const isLabelAnchor = idx === 0;
                                    return (
                                        <td key={`print-foot-${col.id}`} className={`p-2 border-t-2 border-gray-900 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}>
                                            {isLabelAnchor ? "Grand Total" :
                                                aggregates[col.id] !== undefined
                                                    ? col.renderType === "currency" ? `৳${aggregates[col.id].toLocaleString()}` : aggregates[col.id]
                                                    : ""}
                                        </td>
                                    );
                                })}
                            </tr>
                        </tfoot>
                    )}
                </table>

                {/* Footer Authorization */}
                <div className="mt-20 pt-10 flex justify-between items-center text-xs font-bold text-gray-400">
                    <div className="w-48 text-center border-t border-gray-400 pt-2">Generated By</div>
                    <div className="w-48 text-center border-t border-gray-400 pt-2">Authorized Signature</div>
                </div>

            </div>
        </div>
    );
});
PrintableReport.displayName = "PrintableReport";
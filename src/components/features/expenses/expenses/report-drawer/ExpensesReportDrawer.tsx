import * as React from "react";
import { Download, Loader2, Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { ExpenseItem } from "@/hooks/finance_hooks/expenses/useExpensesStore";
import { usePdfDownload } from "@/hooks/shared_hooks/usePdfDownload";
import { ExpenseReportTemplate } from "./ExpenseReportTemplate";

/** Preview of the expense report; "Download PDF" builds the multi-page A4 report file. */
export function ExpenseReportDrawer({ data, isOpen, onClose }: { data: ExpenseItem[]; isOpen: boolean; onClose: () => void }) {
    const printRef = React.useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({ contentRef: printRef, documentTitle: "Expense_Report" });
    const { download, isGenerating } = usePdfDownload();

    const handleDownload = () => {
        download(`Expense_Report_${new Date().toISOString().slice(0, 10)}`, async () => {
            const { ExpenseReportDocument } = await import("@/components/shared/pdf/ExpenseReportDocument");
            return <ExpenseReportDocument data={data} logoUrl={`${window.location.origin}/tekzologo.png`} generatedAt={new Date().toISOString()} />;
        });
    };

    return (
        <Drawer title="Expense Report" isOpen={isOpen} onClose={onClose} width="w-full sm:w-[calc(100vw-260px)]">
            {data.length > 0 && (
                <div className="min-h-full bg-gray-200 p-4 pb-32 sm:p-6 lg:p-12">
                    <div className="mx-auto mb-4 flex max-w-4xl justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => handlePrint()} className="gap-2 bg-white"><Printer className="h-4 w-4" /> Print</Button>
                        <Button type="button" variant="success" onClick={handleDownload} disabled={isGenerating} className="gap-2">
                            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} Download PDF
                        </Button>
                    </div>
                    <div ref={printRef}><ExpenseReportTemplate data={data} /></div>
                </div>
            )}
        </Drawer>
    );
}

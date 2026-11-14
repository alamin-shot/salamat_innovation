import * as React from "react";
import { Download, Loader2, Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { ExpenseItem } from "@/hooks/finance_hooks/expenses/useExpensesStore";
import { usePdfDownload } from "@/hooks/shared_hooks/usePdfDownload";
import { ExpenseVoucherTemplate } from "./ExpenseVoucherTemplate";

/** Preview of one expense voucher; "Download PDF" builds the A4 voucher file. */
export function ExpenseVoucherDrawer({ record, isOpen, onClose }: { record: ExpenseItem | null; isOpen: boolean; onClose: () => void }) {
    const printRef = React.useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({ contentRef: printRef, documentTitle: `Expense_Voucher_${record?.invoiceNumber ?? "preview"}` });
    const { download, isGenerating } = usePdfDownload();

    const handleDownload = () => {
        if (!record) return;
        download(`Expense_Voucher_${record.invoiceNumber}`, async () => {
            const { ExpenseVoucherDocument } = await import("@/components/shared/pdf/ExpenseVoucherDocument");
            return <ExpenseVoucherDocument record={record} logoUrl={`${window.location.origin}/tekzologo.png`} generatedAt={new Date().toISOString()} />;
        });
    };

    return (
        <Drawer title="Expense Voucher" isOpen={isOpen} onClose={onClose} width="w-full sm:w-[calc(100vw-260px)]">
            {record && (
                <div className="min-h-full bg-gray-200 p-4 pb-32 sm:p-6 lg:p-12">
                    <div className="mx-auto mb-4 flex max-w-3xl justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => handlePrint()} className="gap-2 bg-white"><Printer className="h-4 w-4" /> Print</Button>
                        <Button type="button" variant="success" onClick={handleDownload} disabled={isGenerating} className="gap-2">
                            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} Download PDF
                        </Button>
                    </div>
                    <div ref={printRef}><ExpenseVoucherTemplate record={record} /></div>
                </div>
            )}
        </Drawer>
    );
}

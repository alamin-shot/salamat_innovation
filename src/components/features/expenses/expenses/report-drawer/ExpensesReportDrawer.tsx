import { Printer } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { ExpenseReportTemplate } from "./ExpenseReportTemplate";
import { ExpenseItem } from "@/hooks/finance_hooks/expenses/useExpensesStore";

export function ExpenseReportDrawer({ data, isOpen, onClose }: { data: ExpenseItem[]; isOpen: boolean; onClose: () => void; }) {
    if (!isOpen || data.length === 0) return null;
    return (
        <Drawer title="Expense Report" isOpen={isOpen} onClose={onClose} width="w-full max-w-none lg:w-[calc(100vw-280px)]">
            <div className="p-4 sm:p-6 lg:p-12 bg-gray-200 min-h-full pb-20">
                <div className="max-w-4xl mx-auto mb-4 flex justify-end">
                    <Button type="button" variant="outline" onClick={() => window.print()} className="bg-white gap-2"><Printer className="h-4 w-4" /> Download PDF</Button>
                </div>
                <div className="print-section"><ExpenseReportTemplate data={data} /></div>
            </div>
        </Drawer>
    );
}
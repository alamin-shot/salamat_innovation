import { Printer } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { ExpenseVoucherTemplate } from "./ExpenseVoucherTemplate";
import { ExpenseItem } from "@/hooks/finance_hooks/expenses/useExpensesStore";

export function ExpenseVoucherDrawer({ record, isOpen, onClose }: { record: ExpenseItem | null; isOpen: boolean; onClose: () => void; }) {
    if (!isOpen || !record) return null;
    return (
        <Drawer title="Expense Voucher" isOpen={isOpen} onClose={onClose} width="w-full max-w-none lg:w-[calc(100vw-280px)]">
            <div className="p-4 sm:p-6 lg:p-12 bg-gray-200 min-h-full pb-20">
                <div className="max-w-3xl mx-auto mb-4 flex justify-end">
                    <Button type="button" variant="success" onClick={() => window.print()} className="gap-2"><Printer className="h-4 w-4" /> Print Voucher</Button>
                </div>
                <div className="print-section"><ExpenseVoucherTemplate record={record} /></div>
            </div>
        </Drawer>
    );
}


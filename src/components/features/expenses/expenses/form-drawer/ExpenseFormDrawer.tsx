import { CheckCircle2 } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { useExpenseFormManager } from "@/hooks/finance_hooks/expenses/useExpenseFormManager";
import { ExpenseFormFields } from "./ExpenseFormFields";
import { ExpenseItem } from "@/hooks/finance_hooks/expenses/useExpensesStore";

export function ExpenseFormDrawer({
    initialRecord,
    isOpen,
    onClose,
}: {
    initialRecord: ExpenseItem | null;
    isOpen: boolean;
    onClose: () => void;
}) {
    const manager = useExpenseFormManager(initialRecord, onClose);

    if (!isOpen) return null;

    return (
        <Drawer title="Edit Expense" isOpen={isOpen} onClose={onClose} width="w-full max-w-none lg:w-[calc(100vw-280px)]">
            <div className="p-4 sm:p-6 bg-gray-50/50 min-h-full pb-12">
                <div className="flex flex-col gap-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <ExpenseFormFields manager={manager} />
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <Button type="button" variant="success" onClick={manager.handleSave} className="px-6">Submit</Button>
                    </div>
                </div>
            </div>
        </Drawer>
    );
}
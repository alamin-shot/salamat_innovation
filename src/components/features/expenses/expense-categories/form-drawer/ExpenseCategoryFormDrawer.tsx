import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { useExpenseCategoryFormManager } from "@/hooks/finance_hooks/expense_categories/useExpenseCategoryFormManager";
import { ExpenseCategoryFormFields } from "./ExpenseCategoryFormFields";
import { ExpenseCategory } from "@/hooks/finance_hooks/expense_categories/useExpenseCategoryStore";

export function ExpenseCategoryFormDrawer({
    initialRecord,
    isOpen,
    onClose,
}: {
    initialRecord: ExpenseCategory | null;
    isOpen: boolean;
    onClose: () => void;
}) {
    const manager = useExpenseCategoryFormManager(initialRecord, onClose);

    if (!isOpen) return null;

    return (
        <Drawer title="Edit Expense Category" isOpen={isOpen} onClose={onClose} width="w-full max-w-none lg:w-[calc(100vw-280px)]">
            <div className="p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-full pb-12">
                <div className="flex flex-col gap-6 bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-gray-100 max-w-4xl">
                    <ExpenseCategoryFormFields manager={manager} />
                    <div className="flex justify-end pt-6 border-t border-gray-100 mt-4">
                        <Button type="button" variant="success" onClick={manager.handleSave} className="px-8 h-9 font-medium">
                            Submit
                        </Button>
                    </div>
                </div>
            </div>
        </Drawer>
    );
}
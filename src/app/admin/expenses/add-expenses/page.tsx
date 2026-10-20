import { AddExpenseClient } from "@/components/features/expenses/add-expense/AddExpenseClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function AddExpensePage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <AddExpenseClient />
        </Suspense>
    );
}



import { AddExpenseCategoryClient } from "@/components/features/expenses/add-expense-category/AddExpenseCategoryClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function AddExpenseCategoryPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <AddExpenseCategoryClient />
        </Suspense>
    );
}




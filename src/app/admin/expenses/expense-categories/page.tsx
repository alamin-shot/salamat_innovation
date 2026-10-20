import { ExpenseCategoriesClient } from "@/components/features/expenses/expense-categories/ExpenseCategoriesClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function ExpenseCategoriesPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <ExpenseCategoriesClient />
        </Suspense>
    );
}


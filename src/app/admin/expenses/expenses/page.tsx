import { ExpensesClient } from "@/components/features/expenses/expenses/ExpensesClient";
import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";

export default function ExpensesPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <ExpensesClient />
        </Suspense>
    );
}






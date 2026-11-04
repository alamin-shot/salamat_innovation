import { Metadata } from "next";
import { PayrunClient } from "@/components/features/payroll/PayrunClient";
import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";

export const metadata: Metadata = {
    title: "Payruns | Payroll",
    description: "Execute automated payruns and generate employee payslips.",
};

export default function PayrunsPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader /></div>}>
            <PayrunClient />
        </Suspense>
    );
}


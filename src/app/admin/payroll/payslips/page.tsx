import { Metadata } from "next";
import { PayslipClient } from "@/components/features/payroll/PayslipClient";
import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";

export const metadata: Metadata = {
    title: "Payslips | Payroll",
    description: "Review generated payslips, bulk payout, and print official documents.",
};

export default function PayslipsPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader /></div>}>
            <PayslipClient />
        </Suspense>
    );
}


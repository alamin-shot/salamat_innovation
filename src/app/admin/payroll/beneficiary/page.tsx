import { Metadata } from "next";
import { BeneficiaryClient } from "@/components/features/payroll/BeneficiaryClient";
import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";

export const metadata: Metadata = {
    title: "Beneficiaries | Payroll",
    description: "Manage payroll beneficiaries, allowances, deductions, and statutory compliance.",
};

export default function BeneficiaryPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader /></div>}>
            <BeneficiaryClient />
        </Suspense>
    );
}


import { Metadata } from "next";
import { BadgeValueClient } from "@/components/features/payroll/BadgeValueClient";
import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";

export const metadata: Metadata = {
    title: "Badge Values | Payroll",
    description: "Configure default computation bases and amounts for payroll beneficiaries.",
};

export default function BadgeValuePage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader /></div>}>
            <BadgeValueClient />
        </Suspense>
    );
}


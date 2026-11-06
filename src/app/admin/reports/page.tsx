import { Metadata } from "next";
import { ReportClient } from "@/components/features/reports/ReportClient";
import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";

export const metadata: Metadata = {
    title: "Enterprise Reports | Salamat Innovation",
    description: "Universal reporting engine for financials, stock, and operations.",
};

export default function ReportsPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <ReportClient />
        </Suspense>
    );
}


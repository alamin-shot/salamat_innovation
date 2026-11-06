import { Suspense } from "react";
import { DailyClosingClient } from "@/components/features/daily_closing/DailyClosingClient";
import { Loader } from "@/components/shared/loader/Loader";

export const metadata = {
    title: "Daily Closing & Reconciliation | Salamat Innovation ERP",
    description: "End of Day (EOD) financial reconciliation and Z-Report management."
};

export default function DailyClosingPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <DailyClosingClient />
        </Suspense>
    );
}
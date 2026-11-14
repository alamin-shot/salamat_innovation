import { Suspense } from "react";
import { Metadata } from "next";
import { Loader } from "@/components/shared/loader/Loader";
import { DailyClosingClient } from "@/components/features/daily_closing/DailyClosingClient";

export const metadata: Metadata = {
    title: "Profit Loss · Daily Closing | Salamat Innovation ERP",
};

/** Full-page Daily Closing spoke (back link to the Daily Closing hub inside). */
export default function ProfitLossPage() {
    return (
        <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><Loader /></div>}>
            <DailyClosingClient spoke="profit_loss" />
        </Suspense>
    );
}

import { Suspense } from "react";
import { Metadata } from "next";
import { Loader } from "@/components/shared/loader/Loader";
import { DailyClosingClient } from "@/components/features/daily_closing/DailyClosingClient";

export const metadata: Metadata = {
    title: "Sale Returns · Daily Closing | Salamat Innovation ERP",
};

/** Full-page Daily Closing spoke (back link to the Daily Closing hub inside). */
export default function SaleReturnsPage() {
    return (
        <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><Loader /></div>}>
            <DailyClosingClient spoke="sale_return" />
        </Suspense>
    );
}

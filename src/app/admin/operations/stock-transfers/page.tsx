import { Suspense } from "react";
import { Metadata } from "next";
import { Loader } from "@/components/shared/loader/Loader";
import { OperationsSpokePage } from "@/components/features/operations/OperationsSpokePage";

export const metadata: Metadata = {
    title: "Stock Transfers · Operations | Salamat Innovation ERP",
};

/** Full-page Operations spoke (back link to the Operations hub inside). */
export default function StockTransfersPage() {
    return (
        <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><Loader /></div>}>
            <OperationsSpokePage spoke="stock_transfers" />
        </Suspense>
    );
}

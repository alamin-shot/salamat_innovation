import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { LedgerClient } from "@/components/features/ledger/LedgerClient";

export const metadata = {
    title: "Media Library | Salamat Innovation ERP",
};

export default function MediaPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <LedgerClient />
        </Suspense>
    );
}
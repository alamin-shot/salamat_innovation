import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { EmiClient } from "@/components/features/emi-banks/EmiClient";

export const metadata = {
    title: "EMI Banks | Salamat Innovation ERP",
};

export default function EmiBanksPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <EmiClient />
        </Suspense>
    );
}
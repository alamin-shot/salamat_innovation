import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { WarrantyClient } from "@/components/features/warranty/WarrantyClient";

export const metadata = {
    title: "Warranty Claims | Salamat Innovation ERP",
};

export default function WarrantyClaimPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <WarrantyClient />
        </Suspense>
    );
}
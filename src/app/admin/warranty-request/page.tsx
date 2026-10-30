import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { WarrantyClient } from "@/components/features/warranty/WarrantyClient";

export const metadata = {
    title: "Warranty Requests | Salamat Innovation ERP",
};

export default function WarrantyPage() {
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
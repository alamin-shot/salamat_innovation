import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { WarrantyConfigClient } from "@/components/features/warranty/WarrantyConfigClient";

export const metadata = {
    title: "Warranty Policies | Salamat Innovation ERP",
};

export default function WarrantyPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <WarrantyConfigClient />
        </Suspense>
    );
}
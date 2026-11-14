import { Suspense } from "react";
import { Metadata } from "next";
import { Loader } from "@/components/shared/loader/Loader";
import { OperationsClient } from "@/components/features/operations/OperationsClient";

export const metadata: Metadata = {
    title: "Operations | Salamat Innovation ERP",
    description: "Stock transfers, damage products, assets and cash transfers.",
};

export default function OperationsPage() {
    return (
        <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><Loader /></div>}>
            <OperationsClient />
        </Suspense>
    );
}

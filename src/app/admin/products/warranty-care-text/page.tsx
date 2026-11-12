import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { WarrantyCareTextClientManager } from "@/components/features/products-pages/warranty-care-text/WarrantyCareTextClientManager";

export const metadata = { title: "Warranty Care Text | Salamat Innovation ERP" };

export default function WarrantyCareTextPage() {
    return (
        <Suspense fallback={<div className="flex h-full w-full items-center justify-center"><Loader /></div>}>
            <WarrantyCareTextClientManager />
        </Suspense>
    );
}

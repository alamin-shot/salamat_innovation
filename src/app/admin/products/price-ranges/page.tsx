import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { PriceRangesClientManager } from "@/components/features/products-pages/price-ranges/PriceRangesClientManager";

export const metadata = { title: "Price Ranges | Salamat Innovation ERP" };

export default function PriceRangesPage() {
    return (
        <Suspense fallback={<div className="flex h-full w-full items-center justify-center"><Loader /></div>}>
            <PriceRangesClientManager />
        </Suspense>
    );
}

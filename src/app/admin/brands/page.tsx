import { BrandsClientManager } from "@/components/features/brands/BrandsClientManager";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function BrandsPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <BrandsClientManager />
        </Suspense>
    );
}
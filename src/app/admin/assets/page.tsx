import { Suspense } from "react";
import { AssetClient } from "@/components/features/assets/AssetClient";
import { Metadata } from "next";
import { Loader } from "@/components/shared/loader/Loader";

export const metadata: Metadata = {
    title: "Asset Management | Salamat Innovation ERP",
    description: "Track company assets, financial depreciation, warranties, and employee custody logs.",
};

export default function AssetsPage() {
    return (
        <Suspense
            fallback={
                <div className="w-full h-full min-h-[50vh] flex items-center justify-center">
                    <Loader />
                </div>
            }
        >
            <AssetClient />
        </Suspense>
    );
}
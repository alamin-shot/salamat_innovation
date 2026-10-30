import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { GiftClient } from "@/components/features/gift-product/GiftClient";

export const metadata = {
    title: "Gift Products | Salamat Innovation ERP",
};

export default function GiftProductPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <GiftClient />
        </Suspense>
    );
}
import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { SliderClient } from "@/components/features/sliders/SliderClient";

export const metadata = {
    title: "Sliders | Salamat Innovation ERP",
};

export default function SlidersPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader /></div>}>
            <SliderClient />
        </Suspense>
    );
}
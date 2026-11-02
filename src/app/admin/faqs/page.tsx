import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { FaqClient } from "@/components/features/faqs/FaqClient";

export const metadata = { title: "Faqs | Salamat Innovation ERP" };

export default function FaqsPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader /></div>}>
            <FaqClient />
        </Suspense>
    );
}
import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { MediaClient } from "@/components/features/media/MediaClient";

export const metadata = {
    title: "Media Library | Salamat Innovation ERP",
};

export default function MediaPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <MediaClient />
        </Suspense>
    );
}
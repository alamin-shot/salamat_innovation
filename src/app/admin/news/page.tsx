import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { NewsClient } from "@/components/features/news/NewsClient";

export const metadata = {
    title: "News | Salamat Innovation ERP",
};

export default function NewsPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <NewsClient />
        </Suspense>
    );
}
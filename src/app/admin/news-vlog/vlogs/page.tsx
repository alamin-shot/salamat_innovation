import { Suspense } from "react";
import { Metadata } from "next";
import { Loader } from "@/components/shared/loader/Loader";
import { NewsVlogSpokePage } from "@/components/features/news-vlog/NewsVlogSpokePage";

export const metadata: Metadata = {
    title: "Vlog · News & Vlog | Salamat Innovation ERP",
};

/** Full-page News & Vlog spoke (back link to the News & Vlog hub inside). */
export default function VlogPage() {
    return (
        <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><Loader /></div>}>
            <NewsVlogSpokePage spoke="vlogs" />
        </Suspense>
    );
}

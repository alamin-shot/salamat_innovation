import { Suspense } from "react";
import { Metadata } from "next";
import { Loader } from "@/components/shared/loader/Loader";
import { PageMetadataSectionPage } from "@/components/features/seo-hub/page-metadata/PageMetadataSectionPage";

export const metadata: Metadata = {
    title: "Brands · Page Metadata | Salamat Innovation ERP",
};

/** Full-page Page Metadata section (Brands), with back to the Page Metadata hub. */
export default function BrandsMetadataPage() {
    return (
        <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><Loader /></div>}>
            <PageMetadataSectionPage section="brands" />
        </Suspense>
    );
}

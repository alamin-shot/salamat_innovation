import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { CareClient } from "@/components/features/care/CareClient";

export const metadata = {
    title: "Care Services | Salamat Innovation ERP",
};

export default function CarePage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader /></div>}>
            <CareClient />
        </Suspense>
    );
}
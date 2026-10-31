import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { CareerClient } from "@/components/features/careers/CareerClient";

export const metadata = {
    title: "Careers | Salamat Innovation ERP",
};

export default function CareersPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader /></div>}>
            <CareerClient />
        </Suspense>
    );
}
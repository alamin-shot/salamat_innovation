import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { DesignationClient } from "@/components/features/employees/taxonomy/DesignationClient";

export const metadata = { title: "Designations | Salamat Innovation ERP" };

export default function DesignationPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader /></div>}>
            <DesignationClient />
        </Suspense>
    );
}
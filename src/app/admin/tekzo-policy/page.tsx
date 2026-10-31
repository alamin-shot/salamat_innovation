import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { PolicyClient } from "@/components/features/policies/PolicyClient";

export const metadata = { title: "Tekzo Policy | Salamat Innovation ERP" };

export default function TekzoPolicyPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader /></div>}>
            <PolicyClient tenant="tekzo" />
        </Suspense>
    );
}
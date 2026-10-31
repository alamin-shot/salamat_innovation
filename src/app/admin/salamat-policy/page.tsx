import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { PolicyClient } from "@/components/features/policies/PolicyClient";

export const metadata = { title: "Salamat Policy | Salamat Innovation ERP" };

export default function SalamatPolicyPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader /></div>}>
            <PolicyClient tenant="salamat" />
        </Suspense>
    );
}
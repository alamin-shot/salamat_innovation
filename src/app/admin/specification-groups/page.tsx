import { SpecGroupsClientManager } from "@/components/features/specification-groups/SpecGroupsClientManager";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function SpecGroupsPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <SpecGroupsClientManager />
        </Suspense>
    );
}
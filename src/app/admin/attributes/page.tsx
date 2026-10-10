import { AttributesClientManager } from "@/components/features/attributes/AttributesClientManager";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default async function AdminAttributesPage() {

    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <AttributesClientManager />
        </Suspense>
    );
}
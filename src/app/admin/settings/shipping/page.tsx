import { ShippingGlobalView } from "@/components/features/settings/views/ShippingGlobalView";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function ShippingSettingsPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <ShippingGlobalView />
        </Suspense>
    );
}


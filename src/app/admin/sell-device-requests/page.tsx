import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { SellDeviceClient } from "@/components/features/sell-device/SellDeviceClient";

export const metadata = {
    title: "Sell Device Requests | Salamat Innovation ERP",
};

export default function SellDevicePage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <SellDeviceClient />
        </Suspense>
    );
}
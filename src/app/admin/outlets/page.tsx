import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { OutletClient } from "@/components/features/outlets/OutletClient";

export const metadata = { title: "Outlets | Salamat Innovation ERP" };

export default function OutletsPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader /></div>}>
            <OutletClient />
        </Suspense>
    );
}
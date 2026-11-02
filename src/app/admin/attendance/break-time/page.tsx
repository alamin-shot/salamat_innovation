import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { BreakTimeClient } from "@/components/features/attendance/BreakTimeClient";

export const metadata = { title: "Break Time | Salamat Innovation ERP" };
export default function BreakTimePage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader /></div>}>
            <BreakTimeClient />
        </Suspense>
    );
}
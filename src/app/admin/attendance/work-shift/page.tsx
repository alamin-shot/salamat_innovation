import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { WorkShiftClient } from "@/components/features/attendance/WorkShiftClient";

export const metadata = { title: "Work Shift | Salamat Innovation ERP" };
export default function WorkShiftPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader /></div>}>
            <WorkShiftClient />
        </Suspense>
    );
}
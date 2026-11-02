import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { DailyLogClient } from "@/components/features/attendance/DailyLogClient";

export const metadata = { title: "Daily Attendance Log | Salamat Innovation ERP" };

export default function DailyLogPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader /></div>}>
            <DailyLogClient />
        </Suspense>
    );
}
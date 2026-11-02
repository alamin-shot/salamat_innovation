import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { AttendancesClient } from "@/components/features/attendance/AttendancesClient";

export const metadata = { title: "Global Attendances | Salamat Innovation ERP" };

export default function AttendancesPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader /></div>}>
            <AttendancesClient />
        </Suspense>
    );
}
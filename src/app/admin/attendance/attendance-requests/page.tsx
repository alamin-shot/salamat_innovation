import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { AttendanceRequestsClient } from "@/components/features/attendance/AttendanceRequestsClient";

export const metadata = { title: "Attendance Requests | Salamat Innovation ERP" };
export default function AttendanceRequestsPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader /></div>}>
            <AttendanceRequestsClient />
        </Suspense>
    );
}
import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { LeaveRequestClient } from "@/components/features/leaves/leave-requests/LeaveRequestClient";

export const metadata = { title: "Attendance Report | Salamat Innovation ERP" };

export default function AttendanceReportPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader /></div>}>
            <LeaveRequestClient />
        </Suspense>
    );
}
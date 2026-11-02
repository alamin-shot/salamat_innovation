import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { EmployeeStatusClient } from "@/components/features/employees/taxonomy/EmployeeStatusClient";

export const metadata = { title: "Employee Statuses | Salamat Innovation ERP" };

export default function EmployeeStatusPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader /></div>}>
            <EmployeeStatusClient />
        </Suspense>
    );
}
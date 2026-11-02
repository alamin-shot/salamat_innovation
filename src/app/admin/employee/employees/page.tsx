import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { EmployeeClient } from "@/components/features/employees/EmployeeClient";

export const metadata = { title: "Employees | Salamat Innovation ERP" };

export default function EmployeesPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader /></div>}>
            <EmployeeClient />
        </Suspense>
    );
}
import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { DepartmentClient } from "@/components/features/employees/taxonomy/DepartmentClient";

export const metadata = { title: "Departments | Salamat Innovation ERP" };

export default function DepartmentPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader /></div>}>
            <DepartmentClient />
        </Suspense>
    );
}
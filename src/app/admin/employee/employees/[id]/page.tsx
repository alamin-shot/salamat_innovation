import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { EmployeeDetailClient } from "@/components/features/employees/details/EmployeeDetailClient";

export const metadata = { title: "Employee Profile | Salamat Innovation ERP" };

export default async function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
    // In Next.js 15+, params is a Promise that must be awaited
    const { id } = await params;

    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader /></div>}>
            <EmployeeDetailClient employeeId={id} />
        </Suspense>
    );
}
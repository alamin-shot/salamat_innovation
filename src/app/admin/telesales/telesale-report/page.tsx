import { TelesalesReportsClient } from "@/components/features/telesales/telesales-reports/TelesalesClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";


export default function TelesalesReportsPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <TelesalesReportsClient />
        </Suspense>
    );
}



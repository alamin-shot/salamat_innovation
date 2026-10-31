import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { ApplicantClient } from "@/components/features/applicants/ApplicantClient";

export const metadata = {
    title: "Job Applicants | Salamat Innovation ERP",
};

export default function ApplicantsPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader /></div>}>
            <ApplicantClient />
        </Suspense>
    );
}
import { Suspense } from "react";
import { CommunicationsClient } from "@/components/features/communications/CommunicationsClient";
import { Metadata } from "next";
import { Loader } from "@/components/shared/loader/Loader";

export const metadata: Metadata = {
    title: "Corporate Communications | Salamat Innovation ERP",
    description: "Manage global holidays, corporate events, and company-wide announcements.",
};

export default function CommunicationsPage() {
    return (
        <Suspense
            fallback={
                <div className="w-full h-full min-h-[50vh] flex items-center justify-center">
                    <Loader />
                </div>
            }
        >
            <CommunicationsClient />
        </Suspense>
    );
}
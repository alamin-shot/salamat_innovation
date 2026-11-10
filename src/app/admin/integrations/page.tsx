import { Metadata } from "next";
import { Suspense } from "react";
import { IntegrationsClient } from "@/components/features/integrations/IntegrationsClient";
import { Loader } from "@/components/shared/loader/Loader";

export const metadata: Metadata = {
    title: "Integrations & API | Salamat ERP",
    description: "Manage sales channels, couriers, and developer webhooks.",
};

export default function IntegrationsPage() {
    return (
        <Suspense fallback={<Loader />}>
            <IntegrationsClient />
        </Suspense>
    );
}
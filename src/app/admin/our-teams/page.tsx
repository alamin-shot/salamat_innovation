import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { OurTeamClient } from "@/components/features/our-team/OurTeamClient";

export const metadata = {
    title: "Our Teams | Salamat Innovation ERP",
};

export default function OurTeamsPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <OurTeamClient />
        </Suspense>
    );
}
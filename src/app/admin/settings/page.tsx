import { SettingsHubClient } from "@/components/features/settings/SettingsHubClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function SettingsHubPage() {

    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <SettingsHubClient />
        </Suspense>
    );
}

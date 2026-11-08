import { GeneralSettingsView } from "@/components/features/settings/views/GeneralSettingsView";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function GeneralSettingsPage() {

    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <GeneralSettingsView />
        </Suspense>
    );
}

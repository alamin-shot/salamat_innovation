import { NotificationSettingsView } from "@/components/features/settings/views/NotificationSettingsView";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function HRSettingsPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <NotificationSettingsView />
        </Suspense>
    );
}



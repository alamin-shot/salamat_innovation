import { Suspense } from "react";
import { Metadata } from "next";
import { Loader } from "@/components/shared/loader/Loader";
import { SettingsSpokePage } from "@/components/features/settings/SettingsSpokePage";

export const metadata: Metadata = {
    title: "General & Localization · Settings | Salamat Innovation ERP",
};

/** Full-page Settings spoke (back link to the Settings hub inside). */
export default function GeneralLocalizationPage() {
    return (
        <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><Loader /></div>}>
            <SettingsSpokePage spoke="general" />
        </Suspense>
    );
}

import { Settings } from "lucide-react";
import { UniversalHubShell } from "@/components/layout/hub/UniversalHubShell";
import { SETTINGS_HUB_GROUPS } from "@/constants/settingsHub";

/** Settings hub portal: each settings view is its own full page. No client state needed here. */
export function SettingsHubClient() {
    return (
        <UniversalHubShell
            title="Settings Hub"
            subtitle="Manage enterprise configurations, security, and operations."
            icon={Settings}
            groups={SETTINGS_HUB_GROUPS}
        />
    );
}

import { redirectToHub, PageSearchParams } from "@/utils/hubRedirect";

// Now a tab of the Settings hub; old links land on it.
export default async function NotificationsSettingsRedirect({ searchParams }: { searchParams: PageSearchParams }) {
    return redirectToHub("/admin/settings", searchParams, { tab: "notifications" });
}

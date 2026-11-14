import { Suspense } from "react";
import { Metadata } from "next";
import { Loader } from "@/components/shared/loader/Loader";
import { IntegrationsSpokePage } from "@/components/features/integrations/IntegrationsSpokePage";

export const metadata: Metadata = {
    title: "Chat Channels · Integrations & API | Salamat Innovation ERP",
};

/** Full-page Integrations & API spoke (back link to the Integrations & API hub inside). */
export default function ChatChannelsPage() {
    return (
        <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><Loader /></div>}>
            <IntegrationsSpokePage spoke="chat_channels" />
        </Suspense>
    );
}

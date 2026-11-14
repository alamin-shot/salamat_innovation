import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { HubSpokePageProps } from "@/types/hub";
import { HUB_TONE_CLASSES } from "@/constants/hub";
import { HubBreadcrumb } from "./HubBreadcrumb";

// Full-page frame of every spoke route: back to the hub, breadcrumb, spoke title, then the spoke.
// Same scroll contract as the hub: <main> scrolls, this frame is min-h-full.
export function HubSpokePage({ hub, parents = [], label, description, icon: Icon, tone, actions, children }: HubSpokePageProps) {
    return (
        <div className="flex min-h-full w-full flex-col gap-4 p-4">
            <div className="flex flex-col gap-3">
                <HubBreadcrumb links={[...parents, hub]} current={label} />
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href={hub.href}
                            title={`Back to ${hub.title}`}
                            aria-label={`Back to ${hub.title}`}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-brand-subtext/20 bg-white text-brand-subtext shadow-sm transition-colors hover:border-brand-primary/40 hover:text-brand-primary"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${HUB_TONE_CLASSES[tone]}`}>
                            <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-xl font-bold text-brand-text sm:text-2xl">{label}</h1>
                            <p className="text-xs text-brand-subtext sm:text-sm">{description}</p>
                        </div>
                    </div>
                    {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
                </div>
            </div>
            <div className="flex flex-col">{children}</div>
        </div>
    );
}

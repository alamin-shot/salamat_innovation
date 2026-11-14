import * as React from "react";
import Link from "next/link";
import { ArrowLeft, type LucideIcon } from "lucide-react";
import { HubBackLink } from "@/types/hub";
import { HubBreadcrumb } from "./HubBreadcrumb";

interface HubHeaderProps {
    title: string;
    subtitle: string;
    icon: LucideIcon;
    actions?: React.ReactNode;
    /** Set for a hub inside another hub: shows the breadcrumb and a back button to the nearest parent. */
    parents?: HubBackLink[];
}

/** Hub title row. `actions` holds hub-wide controls (e.g. the SEO Salamat / TEKZO switch). */
export function HubHeader({ title, subtitle, icon: Icon, actions, parents = [] }: HubHeaderProps) {
    const backTo = parents[parents.length - 1];
    return (
        <div className="flex flex-col gap-3">
            {backTo && <HubBreadcrumb links={parents} current={title} />}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    {backTo && (
                        <Link
                            href={backTo.href}
                            title={`Back to ${backTo.title}`}
                            aria-label={`Back to ${backTo.title}`}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-brand-subtext/20 bg-white text-brand-subtext shadow-sm transition-colors hover:border-brand-primary/40 hover:text-brand-primary"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    )}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand-primary/20 bg-brand-primary/10 text-brand-primary">
                        <Icon className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-brand-text">{title}</h1>
                        <p className="text-xs sm:text-sm text-brand-subtext">{subtitle}</p>
                    </div>
                </div>
                {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
            </div>
        </div>
    );
}

import * as React from "react";
import type { LucideIcon } from "lucide-react";

interface HubHeaderProps {
    title: string;
    subtitle: string;
    icon: LucideIcon;
    actions?: React.ReactNode;
}

/** Hub title row. `actions` holds hub-wide controls (e.g. the SEO Salamat / TEKZO switch). */
export function HubHeader({ title, subtitle, icon: Icon, actions }: HubHeaderProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
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
    );
}

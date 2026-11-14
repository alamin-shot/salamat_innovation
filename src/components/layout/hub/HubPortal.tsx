import * as React from "react";
import { ChevronRight } from "lucide-react";
import { HubSpokeGroup } from "@/types/hub";
import { HUB_TONE_CLASSES } from "@/constants/hub";

interface HubPortalProps<TabKey extends string> {
    groups: HubSpokeGroup<TabKey>[];
    onOpen: (tab: TabKey) => void;
}

/** The hub's landing view: one card per spoke, grouped. */
export function HubPortal<TabKey extends string>({ groups, onOpen }: HubPortalProps<TabKey>) {
    return (
        <div className="flex flex-col gap-8">
            {groups.map((group) => (
                <section key={group.title} className="flex flex-col gap-3">
                    <div>
                        <h2 className="border-l-4 border-brand-primary pl-2 text-sm font-bold uppercase tracking-wider text-brand-text">{group.title}</h2>
                        {group.description && <p className="mt-1 pl-3 text-xs text-brand-subtext">{group.description}</p>}
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {group.spokes.map((spoke) => {
                            const Icon = spoke.icon;
                            return (
                                <button
                                    key={spoke.id}
                                    type="button"
                                    onClick={() => onOpen(spoke.id)}
                                    className="group flex items-start gap-4 rounded-xl border border-brand-subtext/15 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-primary/40 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50"
                                >
                                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-transform group-hover:scale-105 ${HUB_TONE_CLASSES[spoke.tone]}`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                                        <span className="flex items-center gap-2 font-bold text-brand-text group-hover:text-brand-primary">
                                            {spoke.label}
                                            {spoke.count !== undefined && (
                                                <span className="rounded-full bg-brand-subtext/10 px-2 text-[11px] font-bold text-brand-subtext">{spoke.count}</span>
                                            )}
                                        </span>
                                        <span className="text-xs leading-relaxed text-brand-subtext">{spoke.description}</span>
                                    </div>
                                    <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-brand-subtext transition-transform group-hover:translate-x-0.5 group-hover:text-brand-primary" />
                                </button>
                            );
                        })}
                    </div>
                </section>
            ))}
        </div>
    );
}

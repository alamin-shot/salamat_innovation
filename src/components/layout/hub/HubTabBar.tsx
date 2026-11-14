import * as React from "react";
import { motion } from "framer-motion";
import { LayoutGrid } from "lucide-react";
import { HubHome, HubSpokeDefinition } from "@/types/hub";
import { HUB_HOME } from "@/constants/hub";

interface HubTabBarProps<TabKey extends string> {
    /** Unique per hub, so two hubs never share the animated indicator. */
    hubId: string;
    spokes: HubSpokeDefinition<TabKey>[];
    activeTab: TabKey | HubHome;
    onSelect: (tab: TabKey | HubHome) => void;
}

/**
 * Sticky tab row: "Overview" + one tab per spoke. The active pill glides between tabs
 * (shared layout animation). Sticky inside <main>, the page's only vertical scroller.
 */
export function HubTabBar<TabKey extends string>({ hubId, spokes, activeTab, onSelect }: HubTabBarProps<TabKey>) {
    const tabs: { id: TabKey | HubHome; label: string; count?: number; icon: React.ComponentType<{ className?: string }> }[] = [
        { id: HUB_HOME, label: "Overview", icon: LayoutGrid },
        ...spokes.map((spoke) => ({ id: spoke.id, label: spoke.label, count: spoke.count, icon: spoke.icon })),
    ];

    return (
        <nav aria-label="Hub sections" className="sticky top-0 z-20 -mx-4 border-b border-brand-subtext/10 bg-brand-bg/80 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-brand-bg/70">
            <div role="tablist" className="flex gap-1 overflow-x-auto custom-scrollbar">
                {tabs.map((tab) => {
                    const isActive = tab.id === activeTab;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => onSelect(tab.id)}
                            className={`relative flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50 ${isActive ? "text-white" : "text-brand-subtext hover:bg-white hover:text-brand-text"}`}
                        >
                            {isActive && (
                                <motion.span
                                    layoutId={`hub-tab-indicator-${hubId}`}
                                    className="absolute inset-0 rounded-lg bg-brand-primary shadow-sm"
                                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                                />
                            )}
                            <Icon className="relative h-4 w-4" />
                            <span className="relative">{tab.label}</span>
                            {tab.count !== undefined && (
                                <span className={`relative rounded-full px-1.5 text-[11px] font-bold ${isActive ? "bg-white/20 text-white" : "bg-brand-subtext/10 text-brand-subtext"}`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UniversalHubShellProps } from "@/types/hub";
import { HUB_HOME } from "@/constants/hub";
import { HubHeader } from "./HubHeader";
import { HubKpiStrip } from "./HubKpiStrip";
import { HubTabBar } from "./HubTabBar";
import { HubPortal } from "./HubPortal";

// The one shell every hub uses.
//
// Scroll contract (same as SectionPageShell): AdminLayout's <main> is the ONLY vertical scroller.
// This shell is min-h-full and grows with its content; it never locks itself to the screen height
// or adds an inner overflow box. The tab bar is sticky inside <main>.
//
// Spokes stay separate page components: the shell only calls renderSpoke(tab) for the active one.
export function UniversalHubShell<TabKey extends string>({
    title, subtitle, icon, groups, kpis = [], hub, headerActions, renderSpoke,
}: UniversalHubShellProps<TabKey>) {
    const spokes = groups.flatMap((group) => group.spokes);
    const hubId = title.toLowerCase().replace(/\W+/g, "-");

    return (
        <div className="flex min-h-full w-full flex-col gap-4 p-4">
            <HubHeader title={title} subtitle={subtitle} icon={icon} actions={headerActions} />
            <HubKpiStrip kpis={kpis} />
            <HubTabBar hubId={hubId} spokes={spokes} activeTab={hub.activeTab} onSelect={hub.openTab} />

            <div className={`transition-opacity duration-200 ${hub.isPending ? "pointer-events-none opacity-60" : "opacity-100"}`}>
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={hub.activeTab}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                    >
                        {hub.activeTab === HUB_HOME
                            ? <HubPortal groups={groups} onOpen={hub.openTab} />
                            : renderSpoke(hub.activeTab)}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

"use client";
import { Boxes } from "lucide-react";
import { UniversalHubShell } from "@/components/layout/hub/UniversalHubShell";
import { useOperationsOverview } from "@/hooks/operations_hooks/useOperationsOverview";

/** Operations hub portal: KPIs and spoke cards; each card opens its full-page spoke route. */
export function OperationsClient() {
    const { kpis, groups } = useOperationsOverview();

    return (
        <UniversalHubShell
            title="Operations"
            subtitle="Stock transfers, damaged stock, company assets and cash movements in one place."
            icon={Boxes}
            groups={groups}
            kpis={kpis}
        />
    );
}

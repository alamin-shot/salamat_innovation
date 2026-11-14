"use client";
import * as React from "react";
import { Boxes } from "lucide-react";
import { UniversalHubShell } from "@/components/layout/hub/UniversalHubShell";
import { useHubTab } from "@/hooks/shared_hooks/useHubTab";
import { useOperationsOverview } from "@/hooks/operations_hooks/useOperationsOverview";
import { OperationsTabKey } from "@/types/operations";
import { OPERATIONS_TABS } from "@/constants/operations";
import { StockTransferSpoke } from "./spokes/stock-transfer/StockTransferSpoke";
import { DamageProductsSpoke } from "./spokes/damage-products/DamageProductsSpoke";
import { AssetClient } from "./spokes/assets/AssetClient";
import { CashTransferSpoke } from "./spokes/cash-transfer/CashTransferSpoke";

/** Each spoke is its own component with its own store and manager; the hub only routes. */
const SPOKES: Record<OperationsTabKey, () => React.ReactNode> = {
    stock_transfers: () => <StockTransferSpoke />,
    damage_products: () => <DamageProductsSpoke />,
    assets: () => <AssetClient />,
    cash_transfers: () => <CashTransferSpoke />,
};

export function OperationsClient() {
    const hub = useHubTab<OperationsTabKey>(OPERATIONS_TABS);
    const { kpis, groups } = useOperationsOverview();

    return (
        <UniversalHubShell
            title="Operations"
            subtitle="Stock transfers, damaged stock, company assets and cash movements in one place."
            icon={Boxes}
            groups={groups}
            kpis={kpis}
            hub={hub}
            renderSpoke={(tab) => SPOKES[tab]()}
        />
    );
}

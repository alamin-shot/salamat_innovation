"use client";
import * as React from "react";
import { HubSpokePage } from "@/components/layout/hub/HubSpokePage";
import { useOperationsOverview } from "@/hooks/operations_hooks/useOperationsOverview";
import { OperationsTabKey } from "@/types/operations";
import { OPERATIONS_HUB } from "@/constants/hubRoutes";
import { findSpoke } from "@/utils/hubSpokes";
import { StockTransferSpoke } from "./spokes/stock-transfer/StockTransferSpoke";
import { DamageProductsSpoke } from "./spokes/damage-products/DamageProductsSpoke";
import { AssetClient } from "./spokes/assets/AssetClient";
import { CashTransferSpoke } from "./spokes/cash-transfer/CashTransferSpoke";

/** Each spoke is its own component with its own store and manager. */
const SPOKES: Record<OperationsTabKey, () => React.ReactNode> = {
    stock_transfers: () => <StockTransferSpoke />,
    damage_products: () => <DamageProductsSpoke />,
    assets: () => <AssetClient />,
    cash_transfers: () => <CashTransferSpoke />,
};

/** Full-page Operations spoke with "Back to Operations". */
export function OperationsSpokePage({ spoke }: { spoke: OperationsTabKey }) {
    const meta = findSpoke(useOperationsOverview().groups, spoke);
    return (
        <HubSpokePage hub={OPERATIONS_HUB} label={meta.label} description={meta.description} icon={meta.icon} tone={meta.tone}>
            {SPOKES[spoke]()}
        </HubSpokePage>
    );
}

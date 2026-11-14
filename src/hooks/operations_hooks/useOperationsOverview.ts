import { useMemo } from "react";
import { AlertTriangle, ArrowRightLeft, Banknote, Package } from "lucide-react";
import { useStockTransferStore } from "@/store/useStockTransferStore";
import { useDamageProductStore } from "@/store/useDamageProductStore";
import { useGlobalAssetStore } from "@/store/useGlobalAssetStore";
import { useCashTransferStore } from "@/store/useCashTransferStore";
import { HubKpi, HubSpokeGroup } from "@/types/hub";
import { OperationsTabKey } from "@/types/operations";
import { sumAmounts } from "@/utils/operationsRules";
import { getOperationsHubGroups } from "./operationsHubFactory";

const taka = (amount: number) => `৳ ${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

/**
 * Live KPI strip + portal counts for the Operations hub. Reads each spoke's store separately
 * (each will become its own API call); recomputes only when one of them changes.
 */
export function useOperationsOverview(): { kpis: HubKpi[]; groups: HubSpokeGroup<OperationsTabKey>[] } {
    const transfers = useStockTransferStore((state) => state.transfers);
    const damageProducts = useDamageProductStore((state) => state.damageProducts);
    const assets = useGlobalAssetStore((state) => state.assets);
    const cashTransfers = useCashTransferStore((state) => state.cashTransfers);

    return useMemo(() => {
        const approvedTransfers = transfers.filter((transfer) => transfer.status === "Approved");
        const unitsMoved = approvedTransfers.reduce((sum, transfer) => sum + transfer.serials.length, 0);

        const openDamage = damageProducts.filter((item) => item.status === "Draft");
        const damagedUnits = openDamage.reduce((sum, item) => sum + item.serials.length, 0);

        const bookValue = sumAmounts(assets.map((asset) => asset.currentDepreciatedValue));
        const assigned = assets.filter((asset) => asset.status === "Assigned").length;

        const approvedCash = cashTransfers.filter((transfer) => transfer.status === "Approved");
        const cashMoved = sumAmounts(approvedCash.map((transfer) => transfer.amount));

        const kpis: HubKpi[] = [
            { id: "transfers", label: "Approved Transfers", value: String(approvedTransfers.length), hint: `${plural(unitsMoved, "unit")} moved`, icon: ArrowRightLeft, tone: "blue" },
            { id: "damage", label: "Open Damage Drafts", value: String(openDamage.length), hint: `${plural(damagedUnits, "unit")} awaiting approval`, icon: AlertTriangle, tone: openDamage.length > 0 ? "amber" : "emerald" },
            { id: "assets", label: "Asset Book Value", value: taka(bookValue), hint: `${assigned} of ${assets.length} assigned`, icon: Package, tone: "indigo" },
            { id: "cash", label: "Cash Moved", value: taka(cashMoved), hint: `${plural(approvedCash.length, "approved transfer")}`, icon: Banknote, tone: "emerald" },
        ];

        const groups = getOperationsHubGroups({
            stock_transfers: transfers.length,
            damage_products: damageProducts.length,
            assets: assets.length,
            cash_transfers: cashTransfers.length,
        });

        return { kpis, groups };
    }, [transfers, damageProducts, assets, cashTransfers]);
}

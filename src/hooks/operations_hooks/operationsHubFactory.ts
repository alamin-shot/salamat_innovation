import { AlertTriangle, ArrowRightLeft, Banknote, Package } from "lucide-react";
import { HubSpokeGroup } from "@/types/hub";
import { OperationsTabKey } from "@/types/operations";

/** Portal cards for the Operations hub. Counts come from each spoke's own store. */
export function getOperationsHubGroups(counts: Record<OperationsTabKey, number>): HubSpokeGroup<OperationsTabKey>[] {
    return [
        {
            title: "Inventory Movement",
            description: "Move serialised stock between shops and write off damaged units.",
            spokes: [
                { id: "stock_transfers", label: "Stock Transfers", description: "Shop-to-shop serial transfers with approval", icon: ArrowRightLeft, tone: "blue", count: counts.stock_transfers },
                { id: "damage_products", label: "Damage Products", description: "Damaged-unit write-offs awaiting approval", icon: AlertTriangle, tone: "rose", count: counts.damage_products },
            ],
        },
        {
            title: "Company Resources",
            description: "Fixed assets in custody and cash moved between shops.",
            spokes: [
                { id: "assets", label: "Assets", description: "Asset ledger, custody, depreciation and categories", icon: Package, tone: "indigo", count: counts.assets },
                { id: "cash_transfers", label: "Cash Transfers", description: "Shop-to-shop cash movements with approval", icon: Banknote, tone: "emerald", count: counts.cash_transfers },
            ],
        },
    ];
}

import { ClosingSpokeKey, CLOSING_SPOKE_SLUGS, DAILY_CLOSING_HUB, spokeHref } from "@/constants/hubRoutes";
import {
    Calculator, ShoppingCart, ArrowDownRight, ArrowUpRight,
    RefreshCcw, Package, Wallet, Banknote, ShieldAlert, LucideIcon, Landmark // Added Landmark
} from "lucide-react";

export interface HubItem {
    id: ClosingSpokeKey;
    label: string;
    icon: LucideIcon;
    desc: string;
    color: string;
    count?: number;
}

export interface HubCategory {
    title: string;
    items: HubItem[];
}

/** Full-page spoke link for a closing item, carrying the selected closing date. */
export const closingSpokeHref = (id: ClosingSpokeKey, date: string) => spokeHref(DAILY_CLOSING_HUB, CLOSING_SPOKE_SLUGS[id], { date });

export function getHubCategories(counts: Partial<Record<ClosingSpokeKey, number>>): HubCategory[] {
    return [
        {
            title: "Reconciliation Engine",
            items: [
                { id: "daily_closings", label: "Daily Closings", icon: Calculator, desc: "Split-tender math & EOD lock", color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
                { id: "daily_closing_balance", label: "Daily Closing Balance", count: counts.daily_closing_balance || 0, icon: Wallet, desc: "Historical closing balances", color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
                { id: "profit_loss", label: "Profit Loss", count: counts.profit_loss || 0, icon: Calculator, desc: "Daily P&L statement", color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
                { id: "daily_bank", label: "Daily Bank Records", count: counts.daily_bank || 0, icon: Landmark, desc: "Record deposits & withdrawals", color: "text-emerald-600 bg-emerald-50 border-emerald-100" }
            ]
        },
        {
            title: "Revenue & Receivables",
            items: [
                { id: "sale", label: "Sale Statements", count: counts.sale || 0, icon: ShoppingCart, desc: "Daily POS & online sales", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
                { id: "deposit", label: "Deposit Statements", count: counts.deposit || 0, icon: ArrowDownRight, desc: "Incoming funds & additions", color: "text-emerald-600 bg-emerald-50 border-emerald-100" }
            ]
        },
        // ... (Keep the rest of your existing categories exactly the same)
        {
            title: "Payables & Costs",
            items: [
                { id: "purchase", label: "Purchase Statements", count: counts.purchase || 0, icon: ShoppingCart, desc: "Procurement & vendor bills", color: "text-rose-600 bg-rose-50 border-rose-100" },
                { id: "expense", label: "Expense Statements", count: counts.expense || 0, icon: Banknote, desc: "Daily operational costs", color: "text-rose-600 bg-rose-50 border-rose-100" },
                { id: "withdrawal", label: "Withdrawals", count: counts.withdrawal || 0, icon: ArrowUpRight, desc: "Cash pulled from register", color: "text-rose-600 bg-rose-50 border-rose-100" }
            ]
        },
        {
            title: "Returns & Adjustments",
            items: [
                { id: "sale_return", label: "Sale Returns", count: counts.sale_return || 0, icon: RefreshCcw, desc: "Refunds issued to customers", color: "text-amber-600 bg-amber-50 border-amber-100" },
                { id: "purchase_return", label: "Purchase Returns", count: counts.purchase_return || 0, icon: ShieldAlert, desc: "Refunds from suppliers", color: "text-amber-600 bg-amber-50 border-amber-100" }
            ]
        },
        {
            title: "Assets & Inventory",
            items: [
                { id: "stock", label: "Stock Statements", count: counts.stock || 0, icon: Package, desc: "Daily inventory valuations", color: "text-blue-600 bg-blue-50 border-blue-100" },
                { id: "balance_sheet", label: "Balance Sheets", count: counts.balance_sheet || 0, icon: Wallet, desc: "End of day asset snapshot", color: "text-blue-600 bg-blue-50 border-blue-100" }
            ]
        }
    ];
}
import * as React from "react";
import {
    Package, ShoppingCart, Banknote, Users, Settings,
    FileText, Headphones, Briefcase, AlertTriangle, Component, LayoutDashboard
} from "lucide-react";

// Semantic color resolver for all sub-navigation items
const PALETTE = [
    "text-blue-600 bg-blue-50 border-blue-100",
    "text-indigo-600 bg-indigo-50 border-indigo-100",
    "text-violet-600 bg-violet-50 border-violet-100",
    "text-teal-600 bg-teal-50 border-teal-100",
    "text-cyan-600 bg-cyan-50 border-cyan-100",
    "text-sky-600 bg-sky-50 border-sky-100",
    "text-fuchsia-600 bg-fuchsia-50 border-fuchsia-100",
    "text-orange-600 bg-orange-50 border-orange-100",
];

export const getSubItemColor = (title: string): string => {
    const lower = title.toLowerCase();

    // 1. Positive / Creation / Completion Actions -> Emerald
    if (
        lower.startsWith("add ") ||
        lower.startsWith("create ") ||
        lower.startsWith("generate ") ||
        lower.includes("complete") ||
        lower.includes("confirm") ||
        lower.includes("approve") ||
        lower.includes("verify") ||
        lower.includes("deposit")
    ) {
        return "text-emerald-600 bg-emerald-50 border-emerald-100";
    }

    // 2. Returns / Pending / Holds / Transfers -> Amber
    if (
        lower.includes("return") ||
        lower.includes("pending") ||
        lower.includes("hold") ||
        lower.includes("transfer") ||
        lower.includes("used ") ||
        lower.includes("break")
    ) {
        return "text-amber-600 bg-amber-50 border-amber-100";
    }

    // 3. Danger / Damage / Rejections / Withdrawals / Claims -> Rose
    if (
        lower.includes("damage") ||
        lower.includes("reject") ||
        lower.includes("claim") ||
        lower.includes("withdrawal") ||
        lower.includes("expense")
    ) {
        return "text-rose-600 bg-rose-50 border-rose-100";
    }

    // 4. Deterministic vibrant color for all other items based on title characters
    const hash = title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return PALETTE[hash % PALETTE.length];
};

export const getNavIcon = (title: string, className?: string) => {
    const props = { className };
    const lowerTitle = title.toLowerCase();

    if (lowerTitle.includes("dashboard")) return <LayoutDashboard {...props} />;
    if (lowerTitle.includes("product") || lowerTitle.includes("barcode") || lowerTitle.includes("stock")) return <Package {...props} />;
    if (lowerTitle.includes("sale") || lowerTitle.includes("purchase") || lowerTitle.includes("order")) return <ShoppingCart {...props} />;
    if (lowerTitle.includes("payment") || lowerTitle.includes("expense") || lowerTitle.includes("ledger") || lowerTitle.includes("cash")) return <Banknote {...props} />;
    if (lowerTitle.includes("people") || lowerTitle.includes("employee") || lowerTitle.includes("roles")) return <Users {...props} />;
    if (lowerTitle.includes("setting") || lowerTitle.includes("seo")) return <Settings {...props} />;
    if (lowerTitle.includes("report") || lowerTitle.includes("closing") || lowerTitle.includes("blog")) return <FileText {...props} />;
    if (lowerTitle.includes("chat") || lowerTitle.includes("care") || lowerTitle.includes("support")) return <Headphones {...props} />;
    if (lowerTitle.includes("career") || lowerTitle.includes("teams")) return <Briefcase {...props} />;
    if (lowerTitle.includes("damage product")) return <AlertTriangle {...props} />;

    return <Component {...props} />;
};
import {
    Box, ShoppingCart, DollarSign, Users, Settings,
    FileText, LayoutDashboard, Component, HeadphonesIcon, Briefcase, AlertTriangle
} from "lucide-react";

export const getNavIcon = (title: string, className?: string) => {
    const props = { className };
    const lowerTitle = title.toLowerCase();

    if (lowerTitle.includes("dashboard")) return <LayoutDashboard {...props} />;
    if (lowerTitle.includes("product") || lowerTitle.includes("barcode") || lowerTitle.includes("stock")) return <Box {...props} />;
    if (lowerTitle.includes("sale") || lowerTitle.includes("purchase") || lowerTitle.includes("order")) return <ShoppingCart {...props} />;
    if (lowerTitle.includes("payment") || lowerTitle.includes("expense") || lowerTitle.includes("ledger") || lowerTitle.includes("cash")) return <DollarSign {...props} />;
    if (lowerTitle.includes("people") || lowerTitle.includes("employee") || lowerTitle.includes("roles")) return <Users {...props} />;
    if (lowerTitle.includes("setting") || lowerTitle.includes("seo")) return <Settings {...props} />;
    if (lowerTitle.includes("report") || lowerTitle.includes("closing") || lowerTitle.includes("blog")) return <FileText {...props} />;
    if (lowerTitle.includes("chat") || lowerTitle.includes("care") || lowerTitle.includes("support")) return <HeadphonesIcon {...props} />;
    if (lowerTitle.includes("career") || lowerTitle.includes("teams")) return <Briefcase {...props} />;
    if (lowerTitle.includes("damage product")) return <AlertTriangle {...props} />;

    return <Component {...props} />;
};

export const generateId = (): string => {
    return crypto.randomUUID();
};
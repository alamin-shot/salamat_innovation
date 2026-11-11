import { LucideIcon } from "lucide-react";

export type NavItem = {
    title: string;
    href: string;
    icon: LucideIcon;
    color?: string;
};

export type NavSection = {
    title: string;
    items: NavItem[];
};
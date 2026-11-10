import { LucideIcon } from "lucide-react";

export type NavItem = {
    title: string;
    href: string;
    icon: LucideIcon;
};

export type NavSection = {
    title: string;
    items: NavItem[];
};
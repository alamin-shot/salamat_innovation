import * as React from "react";

export interface Breadcrumb {
    label: string;
    href?: string;
}

export interface SectionPageShellProps {
    /** The page's own heading block (title, subtitle, buttons), rendered unchanged. */
    header: React.ReactNode;
    /** Dims the card and blocks clicks while a URL transition is pending. */
    isPending?: boolean;
    /** Extra classes for the card, e.g. "flex flex-col p-6 gap-2". */
    cardClassName?: string;
    children: React.ReactNode;
}

export interface PageContainerProps {
    title: string;
    breadcrumbs?: Breadcrumb[];
    action?: React.ReactNode;
    children: React.ReactNode;
}
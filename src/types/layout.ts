import * as React from "react";

export interface Breadcrumb {
    label: string;
    href?: string;
}

export interface PageContainerProps {
    title: string;
    breadcrumbs?: Breadcrumb[];
    action?: React.ReactNode;
    children: React.ReactNode;
}
import * as React from "react";

export interface ActionMenuItem {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    variant?: "default" | "danger" | "success";
    divider?: boolean; // Injects a separator line ABOVE this item
}
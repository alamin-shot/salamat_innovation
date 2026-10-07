"use client";
import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreVertical } from "lucide-react";
import { ActionMenuItem } from "@/types/actions";

interface ActionMenuProps {
    items: ActionMenuItem[];
}

export function ActionMenu({ items }: ActionMenuProps) {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button className="flex h-8 w-8 items-center justify-center rounded-md text-brand-subtext transition-colors hover:bg-brand-bg hover:text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary/50">
                    <MoreVertical className="h-4 w-4" />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    align="end"
                    sideOffset={4}
                    collisionPadding={24}
                    className="z-[100] w-56 rounded-lg border border-brand-subtext/20 bg-white py-1 shadow-lg animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95"
                >
                    {items.map((item, index) => (
                        <React.Fragment key={item.label}>
                            {item.divider && <DropdownMenu.Separator className="my-1 h-px bg-brand-subtext/10 mx-2" />}
                            <DropdownMenu.Item
                                onClick={item.onClick}
                                className={`flex w-full cursor-pointer items-center px-4 py-2 text-sm outline-none transition-colors hover:bg-brand-bg/60 focus:bg-brand-bg/60 ${item.variant === "danger" ? "text-red-600 focus:text-red-700" :
                                    item.variant === "success" ? "text-green-600 focus:text-green-700" :
                                        "text-brand-text"
                                    }`}
                            >
                                {item.icon && <span className="mr-2 flex shrink-0">{item.icon}</span>}
                                {item.label}
                            </DropdownMenu.Item>
                        </React.Fragment>
                    ))}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}
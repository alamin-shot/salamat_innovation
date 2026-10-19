"use client";
import * as React from "react";
import { Printer, Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface DamageViewHeaderProps {
    id: string;
    refNo: string;
    status: string;
    onStatusChange?: (id: string, status: "Approved" | "Cancelled") => void;
}

export function DamageViewHeader({ id, refNo, status, onStatusChange }: DamageViewHeaderProps) {
    const badgeVariant = status === "Approved" ? "success" : status === "Cancelled" ? "destructive" : "default";

    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
            <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-gray-800">{refNo}</h2>
                <Badge variant={badgeVariant}>{status}</Badge>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <Button variant="outline" size="sm" className="h-8 text-orange-600 border-orange-200 hover:bg-orange-50 bg-white">
                    <Printer className="h-4 w-4 mr-1.5" /> Print
                </Button>

                {status === "Draft" && (
                    <>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onStatusChange?.(id, "Approved")}
                            className="h-8 text-emerald-700 border-emerald-300 bg-emerald-50 hover:bg-emerald-100"
                        >
                            <Check className="h-4 w-4 mr-1.5" /> Approve
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onStatusChange?.(id, "Cancelled")}
                            className="h-8 text-red-600 border-red-200 bg-red-50 hover:bg-red-100"
                        >
                            <X className="h-4 w-4 mr-1.5" /> Cancel
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
"use client";
import * as React from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";

export function TransferViewHeader({ refNo, status }: { refNo: string, status: string }) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
            <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-gray-800">{refNo}</h2>
                <Badge variant={status === "Approved" ? "success" : "destructive"}>
                    {status}
                </Badge>
            </div>

            <Button variant="outline" size="sm" className="h-8 text-orange-600 border-orange-200 hover:bg-orange-50 bg-white w-full sm:w-auto">
                <Printer className="h-4 w-4 mr-2" /> Print
            </Button>
        </div>
    );
}
"use client";
import { Button } from "@/components/ui/Button";
import { Filter, Columns, Plus } from "lucide-react";

interface RequestsHeaderProps {
    onAddClick: () => void;
}

export function RequestsHeader({ onAddClick }: RequestsHeaderProps) {
    return (
        // RESPONSIVE FIX: flex-col on mobile, flex-row on desktop
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-xl font-bold text-gray-900">Attendance Requests</h1>
                <p className="text-xs text-gray-500 mt-0.5">
                    Regularization workflow — approving a request automatically updates the Master Attendance log.
                </p>
            </div>

            {/* RESPONSIVE FIX: w-full on mobile, wrap buttons */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                <Button variant="outline" size="sm" className="h-9 bg-white flex items-center justify-center gap-1.5 flex-1 sm:flex-none">
                    <Filter className="w-3.5 h-3.5" /> Filter
                </Button>
                <Button variant="outline" size="sm" className="h-9 bg-white flex items-center justify-center gap-1.5 flex-1 sm:flex-none">
                    <Columns className="w-3.5 h-3.5" /> Columns
                </Button>
                <Button
                    variant="default"
                    onClick={onAddClick}
                    className="h-9 flex items-center justify-center gap-1.5 w-full sm:w-auto"
                >
                    <Plus className="w-4 h-4" /> Add Attendance Request
                </Button>
            </div>
        </div>
    );
}
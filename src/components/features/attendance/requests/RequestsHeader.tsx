"use client";
import { Button } from "@/components/ui/Button";
import { Filter, Columns, Plus } from "lucide-react";

interface RequestsHeaderProps {
    onAddClick: () => void;
}

export function RequestsHeader({ onAddClick }: RequestsHeaderProps) {
    return (
        <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
                <h1 className="text-xl font-bold text-gray-900">Attendance Requests</h1>
                <p className="text-xs text-gray-500 mt-0.5">
                    Regularization workflow — approving a request automatically updates the Master Attendance log.
                </p>
            </div>

            <div className="flex items-center gap-2.5">
                <Button variant="outline" size="sm" className="h-9 bg-white flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5" /> Filter
                </Button>
                <Button variant="outline" size="sm" className="h-9 bg-white flex items-center gap-1.5">
                    <Columns className="w-3.5 h-3.5" /> Columns
                </Button>
                <Button
                    variant="default"
                    onClick={onAddClick}
                    className="h-9 flex items-center gap-1.5"
                >
                    <Plus className="w-4 h-4" /> Add Attendance Request
                </Button>
            </div>
        </div>
    );
}
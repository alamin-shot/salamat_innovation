"use client";
import { EntityClient } from "@/components/shared/crud-factory/EntityClient";
import { EntitySchemaField } from "@/components/shared/crud-factory/EntityTable";

const schema: EntitySchemaField[] = [
    { key: "name", label: "Shift Name", type: "text", required: true, isTableColumn: true },
    { key: "startTime", label: "Start Time", type: "text", required: true, isTableColumn: true },
    { key: "endTime", label: "End Time", type: "text", required: true, isTableColumn: true }
];

export function WorkShiftClient() {
    return <EntityClient title="Work Shifts" moduleKey="hrm-work-shifts" schema={schema} />;
}
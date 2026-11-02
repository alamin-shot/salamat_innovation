"use client";
import { EntityClient } from "@/components/shared/crud-factory/EntityClient";
import { EntitySchemaField } from "@/components/shared/crud-factory/EntityTable";

const schema: EntitySchemaField[] = [
    { key: "name", label: "Designation Title", type: "text", required: true, isTableColumn: true },
    { key: "department", label: "Department", type: "text", required: true, isTableColumn: true },
    { key: "description", label: "Description", type: "textarea", isTableColumn: false }
];

export function DesignationClient() {
    return <EntityClient title="Employee Designations" moduleKey="hrm-designations" schema={schema} />;
}
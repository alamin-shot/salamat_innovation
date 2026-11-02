"use client";
import { EntityClient } from "@/components/shared/crud-factory/EntityClient";
import { EntitySchemaField } from "@/components/shared/crud-factory/EntityTable";

const schema: EntitySchemaField[] = [
    { key: "name", label: "Status Label", type: "text", required: true, isTableColumn: true },
    { key: "code", label: "Code Key", type: "text", required: true, isTableColumn: true }
];

export function EmployeeStatusClient() {
    return <EntityClient title="Employee Statuses" moduleKey="hrm-employee-statuses" schema={schema} />;
}
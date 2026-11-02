"use client";
import { EntityClient } from "@/components/shared/crud-factory/EntityClient";
import { EntitySchemaField } from "@/components/shared/crud-factory/EntityTable";

const schema: EntitySchemaField[] = [
    { key: "name", label: "Department Name", type: "text", required: true, isTableColumn: true },
    { key: "head", label: "Department Head", type: "text", isTableColumn: true },
    { key: "code", label: "Dept Code", type: "text", required: true, isTableColumn: true }
];

export function DepartmentClient() {
    return <EntityClient title="Departments" moduleKey="hrm-departments" schema={schema} />;
}
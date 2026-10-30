"use client";
import { EntityClient } from "@/components/shared/crud-factory/EntityClient";
import { EntitySchemaField } from "@/components/shared/crud-factory/EntityTable";

const careSchema: EntitySchemaField[] = [
    { key: "title", label: "Service Title", type: "text", required: true, isTableColumn: true },
    { key: "icon", label: "Icon / Image", type: "image", isTableColumn: true },
    { key: "description", label: "Description", type: "textarea", isTableColumn: false },
    {
        key: "status", label: "Status", type: "select", options: ["Active", "Inactive"], required: true, isTableColumn: true,
        format: (val) => <span className={`text-xs font-bold ${val === 'Active' ? 'text-green-600' : 'text-red-500'}`}>{val}</span>
    }
];

export function CareClient() {
    return <EntityClient title="Customer Care Services" moduleKey="care" schema={careSchema} />;
}
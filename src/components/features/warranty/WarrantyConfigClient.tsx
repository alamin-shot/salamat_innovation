"use client";
import { EntityClient } from "@/components/shared/crud-factory/EntityClient";
import { EntitySchemaField } from "@/components/shared/crud-factory/EntityTable";

const warrantyPolicySchema: EntitySchemaField[] = [
    { key: "title", label: "Warranty Title", type: "text", required: true, isTableColumn: true },
    { key: "duration", label: "Duration (e.g. 1 Year, 6 Months)", type: "text", required: true, isTableColumn: true },
    { key: "description", label: "Terms & Conditions", type: "textarea", isTableColumn: false },
    {
        key: "status", label: "Status", type: "select", options: ["Active", "Inactive"], required: true, isTableColumn: true,
        format: (val) => <span className={`text-xs font-bold ${val === 'Active' ? 'text-green-600' : 'text-red-500'}`}>{val}</span>
    }
];

export function WarrantyConfigClient() {
    return <EntityClient title="Warranty Policies" moduleKey="warranty-policies" schema={warrantyPolicySchema} />;
}
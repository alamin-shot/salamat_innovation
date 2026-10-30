"use client";
import { EntityClient } from "@/components/shared/crud-factory/EntityClient";
import { EntitySchemaField } from "@/components/shared/crud-factory/EntityTable";

const teamSchema: EntitySchemaField[] = [
    { key: "name", label: "Name", type: "text", required: true, isTableColumn: true },
    { key: "designation", label: "Designation", type: "text", required: true, isTableColumn: true },
    { key: "image", label: "Profile Picture", type: "image", isTableColumn: true },
    {
        key: "status", label: "Status", type: "select", options: ["Active", "Inactive"], required: true, isTableColumn: true,
        format: (val) => <span className={`text-xs font-bold ${val === 'Active' ? 'text-green-600' : 'text-red-500'}`}>{val}</span>
    }
];

export function OurTeamClient() {
    return <EntityClient title="Our Team" moduleKey="our-team" schema={teamSchema} />;
}
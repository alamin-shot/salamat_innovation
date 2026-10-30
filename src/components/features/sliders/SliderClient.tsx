"use client";
import { EntityClient } from "@/components/shared/crud-factory/EntityClient";
import { EntitySchemaField } from "@/components/shared/crud-factory/EntityTable";

const sliderSchema: EntitySchemaField[] = [
    { key: "title", label: "Title", type: "text", required: true, isTableColumn: true },
    { key: "image", label: "Desktop Image", type: "image", isTableColumn: true },
    { key: "mobileImage", label: "Mobile Image", type: "image", isTableColumn: false },
    { key: "link", label: "Target URL", type: "url", isTableColumn: true },
    {
        key: "status", label: "Status", type: "select", options: ["Active", "Inactive"], required: true, isTableColumn: true,
        format: (val) => <span className={`text-xs font-bold ${val === 'Active' ? 'text-green-600' : 'text-red-500'}`}>{val}</span>
    }
];

export function SliderClient() {
    return <EntityClient title="Sliders" moduleKey="sliders" schema={sliderSchema} />;
}
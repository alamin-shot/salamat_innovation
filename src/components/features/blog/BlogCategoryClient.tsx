"use client";
import { EntityClient } from "@/components/shared/crud-factory/EntityClient";
import { EntitySchemaField } from "@/components/shared/crud-factory/EntityTable";

const categorySchema: EntitySchemaField[] = [
    { key: "name", label: "Name", type: "text", required: true, isTableColumn: true },
    { key: "slug", label: "Slug", type: "text", required: true, isTableColumn: true },
    { key: "posts", label: "Posts", type: "number", isTableColumn: true },
    {
        key: "status",
        label: "Status",
        type: "select",
        options: ["Active", "Inactive"],
        required: true,
        isTableColumn: true,
        format: (val) => (
            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${val === 'Active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                }`}>
                {val}
            </span>
        )
    }
];

export function BlogCategoryClient() {
    return <EntityClient title="Blog Categories" moduleKey="blog-categories" schema={categorySchema} />;
}
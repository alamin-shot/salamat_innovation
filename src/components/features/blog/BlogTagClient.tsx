"use client";
import { EntityClient } from "@/components/shared/crud-factory/EntityClient";
import { EntitySchemaField } from "@/components/shared/crud-factory/EntityTable";

const tagSchema: EntitySchemaField[] = [
    { key: "name", label: "Name", type: "text", required: true, isTableColumn: true },
    { key: "slug", label: "Slug", type: "text", required: true, isTableColumn: true },
    { key: "posts", label: "Posts", type: "number", isTableColumn: true }
];

export function BlogTagClient() {
    return <EntityClient title="Blog Tags" moduleKey="blog-tags" schema={tagSchema} />;
}
import { EntityClient } from "@/components/shared/crud-factory/EntityClient";
import { EntitySchemaField } from "@/components/shared/crud-factory/EntityTable";

const careSchema: EntitySchemaField[] = [
    { key: "name", label: "Name", type: "text", required: true, isTableColumn: true },
    { key: "value", label: "Value (%)", type: "number", required: true, isTableColumn: true }
];

export default function CarePage() {
    return <EntityClient title="Care" moduleKey="care" schema={careSchema} />;
}
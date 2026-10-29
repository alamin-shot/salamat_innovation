import { EntityClient } from "@/components/shared/crud-factory/EntityClient";
import { EntitySchemaField } from "@/components/shared/crud-factory/EntityTable";
import { Badge } from "@/components/ui/Badge"; // Assumed standard badge

const popupSchema: EntitySchemaField[] = [
    { key: "name", label: "Name", type: "text", required: true, isTableColumn: true },
    { key: "image", label: "Image", type: "image", isTableColumn: true },
    { key: "mobileImage", label: "Mobile Image", type: "image", isTableColumn: true },
    { key: "url", label: "URL", type: "url", isTableColumn: true },
    {
        key: "status", label: "Status", type: "select", options: ["Active", "Inactive"], required: true, isTableColumn: true,
        format: (val) => <span className={`text-xs font-bold ${val === 'Active' ? 'text-green-600' : 'text-red-500'}`}>{val}</span>
    }
];

export default function PopupDialogPage() {
    return <EntityClient title="Popup Dialog" moduleKey="popup-dialog" schema={popupSchema} />;
}
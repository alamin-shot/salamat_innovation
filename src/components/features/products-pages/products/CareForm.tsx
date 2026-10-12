import { RichTextEditor } from "@/components/ui/forms/RichTextEditor";
import { useState } from "react";

export function CareForm({ productId }: { productId: string | null }) {
    const [content, setContent] = useState("");
    return (
        <div className="flex flex-col gap-6">
            <RichTextEditor
                label="Care & Maintenance Instructions"
                value={content}
                onChange={setContent}
            />
            <div className="flex justify-end">
                <button className="rounded-md bg-brand-primary px-6 py-2 text-sm font-semibold text-white">Save Care Details</button>
            </div>
        </div>
    );
}
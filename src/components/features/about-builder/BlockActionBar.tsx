"use client";
import { AboutBuilderManagerType } from "@/hooks/about_hooks/useAboutBuilderManager";
import { BlockType } from "@/store/useAboutBuilderStore";

const AVAILABLE_BLOCKS: { label: string; type: BlockType }[] = [
    { label: "+ Section", type: "section" },
    { label: "+ Row", type: "row" },
    { label: "+ Heading", type: "heading" },
    { label: "+ Paragraph", type: "paragraph" },
    { label: "+ Image", type: "image" },
    { label: "+ Button", type: "button" },
    { label: "+ Profile Card", type: "profileCard" },
    { label: "+ Feature Item", type: "featureItem" },
    { label: "+ Divider", type: "divider" },
    { label: "+ Timeline", type: "timeline" },
    { label: "+ Cards", type: "cards" },
];

export function BlockActionBar({
    manager,
    parentId,
}: {
    manager: AboutBuilderManagerType;
    parentId: string | null;
}) {
    return (
        <div className="flex flex-wrap gap-2 pt-2">
            {AVAILABLE_BLOCKS.map((block) => (
                <button
                    key={block.type}
                    onClick={(e) => {
                        e.stopPropagation();
                        manager.handleAddBlock(parentId, block.type);
                    }}
                    className="flex items-center justify-center px-3 py-1.5 text-[12px] font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:border-emerald-500 hover:text-emerald-700 transition-colors shadow-sm"
                >
                    {block.label}
                </button>
            ))}
            {parentId === null && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        manager.handleAddBlock(parentId, "tabs");
                    }}
                    className="flex items-center justify-center px-3 py-1.5 text-[12px] font-medium text-blue-700 bg-white border border-blue-200 rounded-md hover:border-blue-500 transition-colors shadow-sm ml-1"
                >
                    + Add Tabs
                </button>
            )}
        </div>
    );
}
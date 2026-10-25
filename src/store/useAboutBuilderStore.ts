import { create } from "zustand";
import { persist } from "zustand/middleware";

export type BlockType =
    | "section"
    | "tabs"
    | "tab"
    | "heading"
    | "paragraph"
    | "image"
    | "button"
    | "profileCard"
    | "featureItem"
    | "divider"
    | "row"
    | "timeline"
    | "cards";

export interface BlockSettings {
    isVisible?: boolean;

    // Content & Typography
    text?: string;
    subText?: string;
    roleText?: string;
    fontSize?: string;
    fontWeight?: "normal" | "medium" | "semibold" | "bold";
    textColor?: string;
    textAlign?: "left" | "center" | "right" | "justify";

    // Image & Media
    imageUrl?: string;
    altText?: string;
    imageWidth?: string;
    imageHeight?: string;
    objectFit?: "cover" | "contain" | "fill";
    borderRadius?: string;

    // Button specific
    buttonUrl?: string;
    buttonVariant?: "primary" | "secondary" | "outline";

    // Layout & Placement (Flexbox / Alignment inside Sections & Rows)
    direction?: "row" | "column";
    justify?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around";
    align?: "flex-start" | "center" | "flex-end" | "stretch";
    gap?: string;
    width?: "100%" | "75%" | "66.66%" | "50%" | "33.33%" | "25%" | "auto";

    // Box Model & Background (Matching Screenshots)
    backgroundColor?: string;
    paddingPreset?: "None" | "Small" | "Medium" | "Large";
    marginTop?: string;
    marginRight?: string;
    marginBottom?: string;
    marginLeft?: string;
    paddingTop?: string;
    paddingRight?: string;
    paddingBottom?: string;
    paddingLeft?: string;

    // Borders (Matching Screenshots)
    borderTop?: boolean;
    borderRight?: boolean;
    borderBottom?: boolean;
    borderLeft?: boolean;
    borderColor?: string;
    borderWidth?: string;
}

export interface BlockNode {
    id: string;
    type: BlockType;
    parentId: string | null;
    childrenIds: string[];
    settings: BlockSettings;
}

export interface PlatformState {
    blocks: Record<string, BlockNode>;
    rootBlockIds: string[];
}

interface AboutBuilderStore {
    salamat: PlatformState;
    tekzo: PlatformState;
    addBlock: (
        platform: "salamat" | "tekzo",
        parentId: string | null,
        type: BlockType,
        initialSettings?: Partial<BlockSettings>
    ) => string;
    updateBlock: (
        platform: "salamat" | "tekzo",
        id: string,
        settings: Partial<BlockSettings>
    ) => void;
    deleteBlock: (platform: "salamat" | "tekzo", id: string) => void;
    moveBlock: (
        platform: "salamat" | "tekzo",
        sourceParentId: string | null,
        destParentId: string | null,
        sourceIndex: number,
        destIndex: number
    ) => void;
}

const getDefaultSettings = (type: BlockType): BlockSettings => {
    const base: BlockSettings = {
        isVisible: true,
        backgroundColor: "#ffffff",
        paddingPreset: "Medium",
        marginTop: "0",
        marginRight: "0",
        marginBottom: "0",
        marginLeft: "0",
        paddingTop: "16",
        paddingRight: "16",
        paddingBottom: "16",
        paddingLeft: "16",
        borderTop: false,
        borderRight: false,
        borderBottom: false,
        borderLeft: false,
        borderColor: "#e5e7eb",
        borderWidth: "1",
        direction: "column",
        justify: "flex-start",
        align: "stretch",
        gap: "16",
        width: "100%",
    };

    switch (type) {
        case "section":
            return { ...base, paddingPreset: "Large", paddingTop: "24", paddingBottom: "24", paddingLeft: "24", paddingRight: "24" };
        case "row":
            return { ...base, direction: "row", align: "center", justify: "space-between", gap: "24", paddingTop: "12", paddingBottom: "12" };
        case "tabs":
            return { ...base, paddingPreset: "Medium" };
        case "tab":
            return { ...base, text: "New Tab", paddingPreset: "Medium" };
        case "heading":
            return { ...base, text: "Empowering Innovation & Everyday Tech", fontSize: "28", fontWeight: "bold", textColor: "#111827", textAlign: "left", paddingTop: "4", paddingBottom: "4" };
        case "paragraph":
            return { ...base, text: "We deliver authentic technology products, seamless customer support, and reliable nationwide delivery tailored to modern lifestyles.", fontSize: "15", fontWeight: "normal", textColor: "#4b5563", textAlign: "left", paddingTop: "4", paddingBottom: "4" };
        case "image":
            return { ...base, imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80", altText: "Team workspace", imageWidth: "100%", imageHeight: "260", objectFit: "cover", borderRadius: "12", textAlign: "center" };
        case "button":
            return { ...base, text: "Explore Products", buttonUrl: "/products", buttonVariant: "primary", backgroundColor: "#0caa8d", textColor: "#ffffff", textAlign: "left", borderRadius: "8", width: "auto" };
        case "profileCard":
            return { ...base, text: "SA Foysal", roleText: "Head of Creative", subText: "Leading product design and brand experience.", imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80", textAlign: "center", width: "33.33%", borderRadius: "12" };
        case "featureItem":
            return { ...base, text: "100% Authentic Gear", subText: "Every product is verified and backed by official warranty support.", textAlign: "left", width: "33.33%", backgroundColor: "#f9fafb", borderRadius: "10" };
        case "divider":
            return { ...base, borderBottom: true, borderColor: "#e5e7eb", borderWidth: "1", paddingTop: "8", paddingBottom: "8" };
        case "timeline":
            return { ...base, text: "2026 Milestone", subText: "Expanded physical retail showroom and nationwide express logistics.", direction: "column" };
        case "cards":
            return { ...base, direction: "row", gap: "16", align: "stretch", justify: "flex-start" };
        default:
            return base;
    }
};

const createInitialPlatformData = (brandName: string): PlatformState => ({
    rootBlockIds: ["sec-hero", "tabs-main"],
    blocks: {
        "sec-hero": {
            id: "sec-hero",
            type: "section",
            parentId: null,
            childrenIds: ["row-hero"],
            settings: {
                ...getDefaultSettings("section"),
                backgroundColor: "#ffffff",
                paddingPreset: "Large",
            },
        },
        "row-hero": {
            id: "row-hero",
            type: "row",
            parentId: "sec-hero",
            childrenIds: ["head-hero", "para-hero", "img-hero"],
            settings: {
                ...getDefaultSettings("row"),
                direction: "row",
                align: "center",
                justify: "space-between",
                gap: "24",
            },
        },
        "head-hero": {
            id: "head-hero",
            type: "heading",
            parentId: "row-hero",
            childrenIds: [],
            settings: {
                ...getDefaultSettings("heading"),
                text: `About ${brandName}`,
                width: "50%",
            },
        },
        "para-hero": {
            id: "para-hero",
            type: "paragraph",
            parentId: "row-hero",
            childrenIds: [],
            settings: {
                ...getDefaultSettings("paragraph"),
                text: `Welcome to ${brandName}. Use the right sidebar to align blocks, edit text, upload images, or drag blocks to reorder your layout.`,
                width: "50%",
            },
        },
        "img-hero": {
            id: "img-hero",
            type: "image",
            parentId: "row-hero",
            childrenIds: [],
            settings: {
                ...getDefaultSettings("image"),
                width: "50%",
                imageHeight: "220",
            },
        },
        "tabs-main": {
            id: "tabs-main",
            type: "tabs",
            parentId: null,
            childrenIds: ["tab-1"],
            settings: {
                ...getDefaultSettings("tabs"),
            },
        },
        "tab-1": {
            id: "tab-1",
            type: "tab",
            parentId: "tabs-main",
            childrenIds: ["feat-1"],
            settings: {
                ...getDefaultSettings("tab"),
                text: "Our Mission",
            },
        },
        "feat-1": {
            id: "feat-1",
            type: "featureItem",
            parentId: "tab-1",
            childrenIds: [],
            settings: {
                ...getDefaultSettings("featureItem"),
                width: "100%",
            },
        },
    },
});

export const useAboutBuilderStore = create<AboutBuilderStore>()(
    persist(
        (set) => ({
            salamat: createInitialPlatformData("Salamat Innovation"),
            tekzo: createInitialPlatformData("Tekzo"),

            addBlock: (platform, parentId, type, initialSettings = {}) => {
                const id = crypto.randomUUID();
                set((state) => {
                    const platformState = state[platform];
                    const defaultSettings = getDefaultSettings(type);
                    const newBlock: BlockNode = {
                        id,
                        type,
                        parentId,
                        childrenIds: [],
                        settings: { ...defaultSettings, ...initialSettings },
                    };

                    const newBlocks: Record<string, BlockNode> = {
                        ...platformState.blocks,
                        [id]: newBlock,
                    };

                    // If user adds a "tabs" container, automatically create one child "tab" inside it
                    if (type === "tabs") {
                        const tabId = crypto.randomUUID();
                        newBlocks[tabId] = {
                            id: tabId,
                            type: "tab",
                            parentId: id,
                            childrenIds: [],
                            settings: getDefaultSettings("tab"),
                        };
                        newBlocks[id].childrenIds = [tabId];
                    }

                    if (parentId && newBlocks[parentId]) {
                        newBlocks[parentId] = {
                            ...newBlocks[parentId],
                            childrenIds: [...newBlocks[parentId].childrenIds, id],
                        };
                    }

                    const newRootIds = parentId
                        ? platformState.rootBlockIds
                        : [...platformState.rootBlockIds, id];

                    return {
                        [platform]: {
                            blocks: newBlocks,
                            rootBlockIds: newRootIds,
                        },
                    };
                });
                return id;
            },

            updateBlock: (platform, id, settings) =>
                set((state) => {
                    const platformState = state[platform];
                    const existing = platformState.blocks[id];
                    if (!existing) return state;

                    return {
                        [platform]: {
                            ...platformState,
                            blocks: {
                                ...platformState.blocks,
                                [id]: {
                                    ...existing,
                                    settings: { ...existing.settings, ...settings },
                                },
                            },
                        },
                    };
                }),

            deleteBlock: (platform, id) =>
                set((state) => {
                    const platformState = state[platform];
                    const newBlocks = { ...platformState.blocks };
                    const blockToDelete = newBlocks[id];
                    if (!blockToDelete) return state;

                    const deleteRecursively = (blockId: string) => {
                        const target = newBlocks[blockId];
                        if (target) {
                            target.childrenIds.forEach(deleteRecursively);
                            delete newBlocks[blockId];
                        }
                    };
                    deleteRecursively(id);

                    if (blockToDelete.parentId && newBlocks[blockToDelete.parentId]) {
                        newBlocks[blockToDelete.parentId] = {
                            ...newBlocks[blockToDelete.parentId],
                            childrenIds: newBlocks[blockToDelete.parentId].childrenIds.filter(
                                (childId) => childId !== id
                            ),
                        };
                    }

                    const newRootIds = platformState.rootBlockIds.filter((rId) => rId !== id);

                    return {
                        [platform]: {
                            blocks: newBlocks,
                            rootBlockIds: newRootIds,
                        },
                    };
                }),

            moveBlock: (platform, sourceParentId, destParentId, sourceIndex, destIndex) =>
                set((state) => {
                    const platformState = state[platform];
                    const newBlocks = { ...platformState.blocks };
                    let newRootIds = [...platformState.rootBlockIds];

                    const getList = (pId: string | null) =>
                        pId === null ? [...newRootIds] : [...(newBlocks[pId]?.childrenIds || [])];

                    const sourceList = getList(sourceParentId);
                    const [movedId] = sourceList.splice(sourceIndex, 1);
                    if (!movedId || !newBlocks[movedId]) return state;

                    // Prevent dropping a parent block inside its own descendant
                    let cursor = destParentId;
                    while (cursor) {
                        if (cursor === movedId) return state;
                        cursor = newBlocks[cursor]?.parentId || null;
                    }

                    if (sourceParentId === destParentId) {
                        sourceList.splice(destIndex, 0, movedId);
                        if (sourceParentId === null) {
                            newRootIds = sourceList;
                        } else if (newBlocks[sourceParentId]) {
                            newBlocks[sourceParentId] = {
                                ...newBlocks[sourceParentId],
                                childrenIds: sourceList,
                            };
                        }
                    } else {
                        const destList = getList(destParentId);
                        destList.splice(destIndex, 0, movedId);

                        if (sourceParentId === null) {
                            newRootIds = sourceList;
                        } else if (newBlocks[sourceParentId]) {
                            newBlocks[sourceParentId] = {
                                ...newBlocks[sourceParentId],
                                childrenIds: sourceList,
                            };
                        }

                        if (destParentId === null) {
                            newRootIds = destList;
                        } else if (newBlocks[destParentId]) {
                            newBlocks[destParentId] = {
                                ...newBlocks[destParentId],
                                childrenIds: destList,
                            };
                        }

                        newBlocks[movedId] = {
                            ...newBlocks[movedId],
                            parentId: destParentId,
                        };
                    }

                    return {
                        [platform]: {
                            blocks: newBlocks,
                            rootBlockIds: newRootIds,
                        },
                    };
                }),
        }),
        { name: "erp-about-builder-storage-v2" }
    )
);
"use client";
import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import type { DropResult } from "@hello-pangea/dnd";
import {
    useAboutBuilderStore,
    BlockType,
    BlockSettings,
} from "@/store/useAboutBuilderStore";

export function useAboutBuilderManager(platform: "salamat" | "tekzo") {
    const store = useAboutBuilderStore();
    const platformData = store[platform];

    const [activeBlockId, setActiveBlockId] = useState<string | null>("sec-hero");
    const [isPreviewMode, setIsPreviewMode] = useState(false);

    // Tracks active tab selection per "tabs" container so you can switch tabs on the canvas
    const [activeTabMap, setActiveTabMap] = useState<Record<string, string>>({});

    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        idToDelete: "",
    });
    const closeConfirm = () => setConfirmModal({ isOpen: false, idToDelete: "" });

    const handleAddBlock = useCallback(
        (
            parentId: string | null,
            type: BlockType,
            initialSettings?: Partial<BlockSettings>
        ) => {
            const newId = store.addBlock(platform, parentId, type, initialSettings);
            setActiveBlockId(newId);
            toast.success(`${type} block added`);
        },
        [platform, store]
    );

    const handleUpdateSettings = useCallback(
        (id: string, settings: Partial<BlockSettings>) => {
            store.updateBlock(platform, id, settings);
        },
        [platform, store]
    );

    // Converts uploaded image file into a persistent Data URL (or replace with API upload)
    const handleImageUpload = useCallback(
        (id: string, file: File) => {
            if (!file.type.startsWith("image/")) {
                toast.error("Please select a valid image file.");
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result === "string") {
                    store.updateBlock(platform, id, {
                        imageUrl: reader.result,
                        altText: file.name,
                    });
                    toast.success("Image updated!");
                }
            };
            reader.readAsDataURL(file);
        },
        [platform, store]
    );

    // Handles @hello-pangea/dnd drag end
    const handleDragEnd = useCallback(
        (result: DropResult) => {
            const { source, destination } = result;
            if (!destination) return;
            if (
                source.droppableId === destination.droppableId &&
                source.index === destination.index
            ) {
                return;
            }

            const parseParentId = (droppableId: string) =>
                droppableId === "root-canvas" ? null : droppableId;

            store.moveBlock(
                platform,
                parseParentId(source.droppableId),
                parseParentId(destination.droppableId),
                source.index,
                destination.index
            );
        },
        [platform, store]
    );

    const requestDeleteBlock = useCallback((id: string) => {
        setConfirmModal({ isOpen: true, idToDelete: id });
    }, []);

    const confirmDeleteBlock = useCallback(() => {
        if (confirmModal.idToDelete) {
            store.deleteBlock(platform, confirmModal.idToDelete);
            if (activeBlockId === confirmModal.idToDelete) {
                setActiveBlockId(null);
            }
            toast.success("Block deleted");
        }
        closeConfirm();
    }, [confirmModal.idToDelete, platform, store, activeBlockId]);

    const handleSavePage = useCallback(() => {
        toast.success(`${platform.toUpperCase()} About Us layout saved!`);
    }, [platform]);

    const blocks = useMemo(() => platformData.blocks, [platformData.blocks]);
    const rootBlockIds = useMemo(
        () => platformData.rootBlockIds,
        [platformData.rootBlockIds]
    );

    return {
        platform,
        blocks,
        rootBlockIds,
        activeBlockId,
        setActiveBlockId,
        isPreviewMode,
        setIsPreviewMode,
        activeTabMap,
        setActiveTabMap,
        handleAddBlock,
        handleUpdateSettings,
        handleImageUpload,
        handleDragEnd,
        requestDeleteBlock,
        confirmDeleteBlock,
        handleSavePage,
        confirmModal,
        closeConfirm,
    };
}

export type AboutBuilderManagerType = ReturnType<typeof useAboutBuilderManager>;
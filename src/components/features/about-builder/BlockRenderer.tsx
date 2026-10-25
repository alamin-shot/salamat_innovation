"use client";
import { AboutBuilderManagerType } from "@/hooks/about_hooks/useAboutBuilderManager";
import { BlockActionBar } from "./BlockActionBar";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { Trash2, GripVertical, Image as ImageIcon, Upload } from "lucide-react";

export function BlockRenderer({
    id,
    index,
    manager,
}: {
    id: string;
    index: number;
    manager: AboutBuilderManagerType;
}) {
    const block = manager.blocks[id];
    if (!block) return null;

    const isActive = manager.activeBlockId === id;
    const { isPreviewMode } = manager;
    const s = block.settings;

    // Build box model inline styles matching your screenshot settings
    const computedStyle: React.CSSProperties = {
        backgroundColor: s.backgroundColor || "#ffffff",
        marginTop: `${s.marginTop || 0}px`,
        marginRight: `${s.marginRight || 0}px`,
        marginBottom: `${s.marginBottom || 0}px`,
        marginLeft: `${s.marginLeft || 0}px`,
        paddingTop: `${s.paddingTop || 16}px`,
        paddingRight: `${s.paddingRight || 16}px`,
        paddingBottom: `${s.paddingBottom || 16}px`,
        paddingLeft: `${s.paddingLeft || 16}px`,
        borderTop: s.borderTop ? `${s.borderWidth || 1}px solid ${s.borderColor || "#e5e7eb"}` : "none",
        borderRight: s.borderRight ? `${s.borderWidth || 1}px solid ${s.borderColor || "#e5e7eb"}` : "none",
        borderBottom: s.borderBottom ? `${s.borderWidth || 1}px solid ${s.borderColor || "#e5e7eb"}` : "none",
        borderLeft: s.borderLeft ? `${s.borderWidth || 1}px solid ${s.borderColor || "#e5e7eb"}` : "none",
        width: s.width || "100%",
        display: ["section", "row", "cards", "timeline", "tabs", "tab"].includes(block.type) ? "flex" : undefined,
        flexDirection: s.direction || "column",
        justifyContent: s.justify || "flex-start",
        alignItems: s.align || "stretch",
        gap: `${s.gap || 16}px`,
        flexWrap: "wrap",
    };

    const isContainer = ["section", "row", "cards", "timeline", "tabs", "tab"].includes(block.type);

    return (
        <Draggable draggableId={id} index={index} isDragDisabled={isPreviewMode}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    onClick={(e) => {
                        e.stopPropagation();
                        manager.setActiveBlockId(id);
                    }}
                    style={{
                        ...provided.draggableProps.style,
                    }}
                    className={`relative rounded-xl transition-all ${isPreviewMode
                        ? ""
                        : isActive
                            ? "ring-2 ring-emerald-500 shadow-lg bg-white"
                            : "border border-gray-200/80 hover:border-emerald-300 shadow-sm bg-white"
                        } ${snapshot.isDragging ? "opacity-75 shadow-2xl rotate-1" : ""}`}
                >
                    {/* Builder Mode Header Bar */}
                    {!isPreviewMode && (
                        <div className="flex items-center justify-between bg-gray-50/90 border-b border-gray-100 px-4 py-2 rounded-t-xl select-none">
                            <div className="flex items-center gap-2">
                                <div {...provided.dragHandleProps} className="cursor-grab text-gray-400 hover:text-gray-600">
                                    <GripVertical className="h-4 w-4" />
                                </div>
                                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                    {block.type === "tab" ? `Tab: ${s.text || "Untitled"}` : block.type}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-gray-400 font-mono">ID: {id.slice(0, 6)}</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        manager.requestDeleteBlock(id);
                                    }}
                                    className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50"
                                    title="Delete block"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Live Render Content Body */}
                    <div style={computedStyle} className="rounded-b-xl transition-all">
                        {/* 1. Heading */}
                        {block.type === "heading" && (
                            <h2
                                style={{
                                    fontSize: `${s.fontSize || 28}px`,
                                    fontWeight: s.fontWeight || "bold",
                                    color: s.textColor || "#111827",
                                    textAlign: s.textAlign || "left",
                                    width: "100%",
                                }}
                                className="leading-tight outline-none focus:ring-1 focus:ring-emerald-500 rounded px-1"
                                contentEditable={!isPreviewMode}
                                suppressContentEditableWarning
                                onBlur={(e) => manager.handleUpdateSettings(id, { text: e.currentTarget.textContent || "" })}
                            >
                                {s.text || "Heading title here..."}
                            </h2>
                        )}

                        {/* 2. Paragraph */}
                        {block.type === "paragraph" && (
                            <p
                                style={{
                                    fontSize: `${s.fontSize || 15}px`,
                                    color: s.textColor || "#4b5563",
                                    textAlign: s.textAlign || "left",
                                    width: "100%",
                                }}
                                className="leading-relaxed outline-none focus:ring-1 focus:ring-emerald-500 rounded px-1"
                                contentEditable={!isPreviewMode}
                                suppressContentEditableWarning
                                onBlur={(e) => manager.handleUpdateSettings(id, { text: e.currentTarget.textContent || "" })}
                            >
                                {s.text || "Enter description or paragraph text here..."}
                            </p>
                        )}

                        {/* 3. Image with Live Upload */}
                        {block.type === "image" && (
                            <div className="flex flex-col gap-2 w-full" style={{ textAlign: s.textAlign || "center" }}>
                                {s.imageUrl ? (
                                    <div className="relative group inline-block mx-auto">
                                        <img
                                            src={s.imageUrl}
                                            alt={s.altText || "About image"}
                                            style={{
                                                width: s.imageWidth || "100%",
                                                height: `${s.imageHeight || 260}px`,
                                                objectFit: s.objectFit || "cover",
                                                borderRadius: `${s.borderRadius || 8}px`,
                                            }}
                                            className="shadow-sm transition-all"
                                        />
                                        {!isPreviewMode && (
                                            <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold rounded cursor-pointer gap-2">
                                                <Upload className="h-4 w-4" /> Change Image
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) manager.handleImageUpload(id, file);
                                                    }}
                                                />
                                            </label>
                                        )}
                                    </div>
                                ) : !isPreviewMode ? (
                                    <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 bg-gray-50/50 transition-colors">
                                        <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                                        <span className="text-xs font-semibold text-gray-700">Click to upload image</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) manager.handleImageUpload(id, file);
                                            }}
                                        />
                                    </label>
                                ) : null}
                            </div>
                        )}

                        {/* 4. Button */}
                        {block.type === "button" && (
                            <div style={{ textAlign: s.textAlign || "left", width: "100%" }}>
                                <span
                                    style={{
                                        backgroundColor: s.backgroundColor || "#0caa8d",
                                        color: s.textColor || "#ffffff",
                                        borderRadius: `${s.borderRadius || 6}px`,
                                    }}
                                    className="inline-block px-5 py-2.5 text-sm font-semibold shadow-sm transition-transform active:scale-95 cursor-pointer"
                                >
                                    {s.text || "Button Text"}
                                </span>
                            </div>
                        )}

                        {/* 5. Profile Card */}
                        {block.type === "profileCard" && (
                            <div className="flex flex-col items-center p-5 bg-white border border-gray-100 rounded-xl shadow-sm text-center w-full">
                                <img
                                    src={s.imageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                                    alt={s.text || "Profile"}
                                    className="h-20 w-20 rounded-full object-cover mb-3 shadow-md border-2 border-emerald-500/20"
                                />
                                <h4 className="font-bold text-gray-900 text-base">{s.text || "Team Member"}</h4>
                                <p className="text-xs font-semibold text-emerald-600 mb-1">{s.roleText || "Role Title"}</p>
                                <p className="text-xs text-gray-500">{s.subText || "Short biography or description..."}</p>
                            </div>
                        )}

                        {/* 6. Feature Item */}
                        {block.type === "featureItem" && (
                            <div className="flex flex-col p-5 bg-white border border-gray-100 rounded-xl shadow-sm w-full">
                                <h4 className="font-bold text-gray-900 text-sm mb-1">{s.text || "Feature Title"}</h4>
                                <p className="text-xs text-gray-500 leading-relaxed">{s.subText || "Feature description details..."}</p>
                            </div>
                        )}

                        {/* 7. Divider */}
                        {block.type === "divider" && <hr className="w-full my-2 border-gray-200" />}

                        {/* 8. Tabs Container & Items */}
                        {block.type === "tabs" && (
                            <div className="flex flex-col w-full">
                                {/* Tab Header Navigation */}
                                <div className="flex items-center gap-2 border-b border-gray-200 pb-3 mb-4">
                                    {block.childrenIds.map((tabId) => {
                                        const tabBlock = manager.blocks[tabId];
                                        if (!tabBlock) return null;
                                        const isTabActive = manager.activeTabMap[id] === tabId || (!manager.activeTabMap[id] && block.childrenIds[0] === tabId);
                                        return (
                                            <button
                                                key={tabId}
                                                onClick={(ev) => {
                                                    ev.stopPropagation();
                                                    manager.setActiveTabMap({ ...manager.activeTabMap, [id]: tabId });
                                                }}
                                                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${isTabActive
                                                    ? "bg-emerald-600 text-white shadow-sm"
                                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                    }`}
                                            >
                                                {tabBlock.settings.text || "Tab"}
                                            </button>
                                        );
                                    })}
                                    {!isPreviewMode && (
                                        <button
                                            onClick={(ev) => {
                                                ev.stopPropagation();
                                                manager.handleAddBlock(id, "tab", { text: `Tab ${block.childrenIds.length + 1}` });
                                            }}
                                            className="px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200"
                                        >
                                            + Add Tab
                                        </button>
                                    )}
                                </div>

                                {/* Active Tab Content Body */}
                                <div className="w-full">
                                    {block.childrenIds.map((tabId) => {
                                        const isTabActive = manager.activeTabMap[id] === tabId || (!manager.activeTabMap[id] && block.childrenIds[0] === tabId);
                                        if (!isTabActive) return null;
                                        return <BlockRenderer key={tabId} id={tabId} index={0} manager={manager} />;
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Recursive Droppable Area for Containers (Sections, Rows, Tabs) */}
                        {isContainer && block.type !== "tabs" && (
                            <Droppable droppableId={id} type="BLOCK">
                                {(dropProvided, dropSnapshot) => (
                                    <div
                                        ref={dropProvided.innerRef}
                                        {...dropProvided.droppableProps}
                                        className={`flex flex-col gap-4 w-full min-h-[60px] transition-colors rounded-lg ${dropSnapshot.isDraggingOver ? "bg-emerald-50/40 border-2 border-dashed border-emerald-400 p-2" : ""
                                            }`}
                                    >
                                        {block.childrenIds.map((childId, cIdx) => (
                                            <BlockRenderer key={childId} id={childId} index={cIdx} manager={manager} />
                                        ))}
                                        {dropProvided.placeholder}

                                        {!isPreviewMode && block.childrenIds.length === 0 && (
                                            <div className="py-4 text-center text-xs text-gray-400 font-medium italic">
                                                Container empty. Drop blocks or add items below.
                                            </div>
                                        )}

                                        {!isPreviewMode && (
                                            <div className="pt-2">
                                                <BlockActionBar manager={manager} parentId={id} />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Droppable>
                        )}
                    </div>
                </div>
            )}
        </Draggable>
    );
}
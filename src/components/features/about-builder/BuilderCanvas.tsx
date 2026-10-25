"use client";
import { AboutBuilderManagerType } from "@/hooks/about_hooks/useAboutBuilderManager";
import { BlockRenderer } from "./BlockRenderer";
import { BlockActionBar } from "./BlockActionBar";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { Eye, Edit3, Save } from "lucide-react";

export function BuilderCanvas({ manager }: { manager: AboutBuilderManagerType }) {
    return (
        <div className="flex-1 erp-card flex flex-col p-0 overflow-hidden bg-white shadow-sm border border-gray-100 rounded-xl">
            {/* Top Canvas Header Bar */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-gray-50/70">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-800 capitalize">
                        {manager.platform} · About Us Visual Studio
                    </span>
                    <div className="flex items-center bg-gray-200/70 p-0.5 rounded-lg">
                        <button
                            onClick={() => manager.setIsPreviewMode(false)}
                            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${!manager.isPreviewMode
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-500 hover:text-gray-900"
                                }`}
                        >
                            <Edit3 className="h-3.5 w-3.5" />
                            Builder Mode
                        </button>
                        <button
                            onClick={() => manager.setIsPreviewMode(true)}
                            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${manager.isPreviewMode
                                    ? "bg-emerald-600 text-white shadow-sm"
                                    : "text-gray-500 hover:text-gray-900"
                                }`}
                        >
                            <Eye className="h-3.5 w-3.5" />
                            Live Preview
                        </button>
                    </div>
                </div>

                <button
                    onClick={manager.handleSavePage}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-md font-medium text-xs transition-colors shadow-sm"
                >
                    <Save className="h-3.5 w-3.5" />
                    Save Layout
                </button>
            </div>

            {/* Drag Drop Canvas Body */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-gray-50/30">
                <DragDropContext onDragEnd={manager.handleDragEnd}>
                    <Droppable droppableId="root-canvas" type="BLOCK">
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="flex flex-col gap-5 min-h-[400px] pb-24"
                            >
                                {manager.rootBlockIds.length === 0 ? (
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 flex flex-col items-center justify-center text-center bg-white">
                                        <p className="text-gray-500 font-medium mb-4 text-sm">
                                            Your About Us canvas is empty. Start adding sections below.
                                        </p>
                                        <BlockActionBar manager={manager} parentId={null} />
                                    </div>
                                ) : (
                                    manager.rootBlockIds.map((id, index) => (
                                        <BlockRenderer
                                            key={id}
                                            id={id}
                                            index={index}
                                            manager={manager}
                                        />
                                    ))
                                )}
                                {provided.placeholder}

                                {/* Root Level Add Buttons */}
                                {!manager.isPreviewMode && (
                                    <div className="flex items-center gap-3 pt-4 border-t border-gray-200/60">
                                        <button
                                            onClick={() => manager.handleAddBlock(null, "section")}
                                            className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg transition-colors border border-emerald-200"
                                        >
                                            + Add Root Section
                                        </button>
                                        <button
                                            onClick={() => manager.handleAddBlock(null, "tabs")}
                                            className="text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors border border-blue-200"
                                        >
                                            + Add Tabs Container
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    );
}
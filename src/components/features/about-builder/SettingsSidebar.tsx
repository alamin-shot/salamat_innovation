"use client";
import { AboutBuilderManagerType } from "@/hooks/about_hooks/useAboutBuilderManager";

export function SettingsSidebar({ manager }: { manager: AboutBuilderManagerType }) {
    const activeBlock = manager.activeBlockId ? manager.blocks[manager.activeBlockId] : null;

    if (!activeBlock) {
        return (
            <div className="w-full md:w-80 shrink-0 erp-card flex items-center justify-center p-6 bg-white text-gray-400 font-medium text-[13px] rounded-xl shadow-sm border border-gray-100">
                Click any block on the canvas to configure its layout & styles
            </div>
        );
    }

    const update = (key: string, value: any) => {
        manager.handleUpdateSettings(activeBlock.id, { [key]: value });
    };

    const s = activeBlock.settings;
    const isContainer = ["section", "row", "cards", "timeline", "tabs", "tab"].includes(activeBlock.type);

    return (
        <div className="w-full md:w-80 shrink-0 erp-card flex flex-col bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
                <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                    <h3 className="font-bold text-gray-800 text-sm capitalize">{activeBlock.type} Settings</h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500">Visible</span>
                    <input
                        type="checkbox"
                        checked={s.isVisible !== false}
                        onChange={(e) => update("isVisible", e.target.checked)}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                </div>
            </div>

            <div className="p-5 overflow-y-auto custom-scrollbar flex flex-col gap-6 flex-1 text-xs">
                {/* 1. Text / Content Inputs */}
                {(["heading", "paragraph", "button", "tab", "profileCard", "featureItem", "timeline"].includes(activeBlock.type)) && (
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">
                            {activeBlock.type === "tab" ? "Tab Label" : activeBlock.type === "profileCard" ? "Name" : "Main Text / Content"}
                        </label>
                        {activeBlock.type === "paragraph" || activeBlock.type === "timeline" ? (
                            <textarea
                                value={s.text || ""}
                                onChange={(e) => update("text", e.target.value)}
                                className="erp-input h-20 py-2 resize-none text-xs"
                            />
                        ) : (
                            <input
                                type="text"
                                value={s.text || ""}
                                onChange={(e) => update("text", e.target.value)}
                                className="erp-input text-xs"
                            />
                        )}
                    </div>
                )}

                {/* Profile Card & Timeline Secondary Fields */}
                {activeBlock.type === "profileCard" && (
                    <>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Role / Title</label>
                            <input type="text" value={s.roleText || ""} onChange={(e) => update("roleText", e.target.value)} className="erp-input text-xs" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Biography / Subtext</label>
                            <textarea value={s.subText || ""} onChange={(e) => update("subText", e.target.value)} className="erp-input h-16 resize-none text-xs" />
                        </div>
                    </>
                )}

                {/* 2. Flexbox Placement & Layout (For Sections & Rows to align text/images side-by-side) */}
                {isContainer && (
                    <div className="flex flex-col gap-3 p-3 bg-emerald-50/40 border border-emerald-100 rounded-lg">
                        <span className="font-bold text-gray-800 text-xs border-b border-emerald-100 pb-1">
                            Flexbox Placement & Alignment
                        </span>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-gray-500 font-medium">Layout Direction</label>
                                <select
                                    value={s.direction || "column"}
                                    onChange={(e) => update("direction", e.target.value)}
                                    className="erp-input text-xs py-1"
                                >
                                    <option value="column">Vertical (Column)</option>
                                    <option value="row">Horizontal (Row)</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-gray-500 font-medium">Item Gap (px)</label>
                                <input
                                    type="number"
                                    value={s.gap || "16"}
                                    onChange={(e) => update("gap", e.target.value)}
                                    className="erp-input text-xs py-1 text-center"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-gray-500 font-medium">Horizontal Justify</label>
                                <select
                                    value={s.justify || "flex-start"}
                                    onChange={(e) => update("justify", e.target.value)}
                                    className="erp-input text-xs py-1"
                                >
                                    <option value="flex-start">Start</option>
                                    <option value="center">Center</option>
                                    <option value="flex-end">End</option>
                                    <option value="space-between">Space Between</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-gray-500 font-medium">Vertical Align</label>
                                <select
                                    value={s.align || "stretch"}
                                    onChange={(e) => update("align", e.target.value)}
                                    className="erp-input text-xs py-1"
                                >
                                    <option value="stretch">Stretch</option>
                                    <option value="flex-start">Top</option>
                                    <option value="center">Middle</option>
                                    <option value="flex-end">Bottom</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Width Selector for items inside rows */}
                <div className="flex flex-col gap-1.5">
                    <label className="erp-label">Block Width (Responsive)</label>
                    <select
                        value={s.width || "100%"}
                        onChange={(e) => update("width", e.target.value)}
                        className="erp-input text-xs"
                    >
                        <option value="100%">100% (Full Width)</option>
                        <option value="75%">75% (Three Quarters)</option>
                        <option value="66.66%">66% (Two Thirds)</option>
                        <option value="50%">50% (Half / Side-by-side)</option>
                        <option value="33.33%">33% (One Third)</option>
                        <option value="25%">25% (Quarter)</option>
                        <option value="auto">Auto</option>
                    </select>
                </div>

                {/* 3. Image Settings */}
                {activeBlock.type === "image" && (
                    <div className="flex flex-col gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200/80">
                        <span className="font-bold text-gray-800 text-xs">Image Dimensions & Fit</span>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-gray-500">Height (px)</label>
                                <input
                                    type="number"
                                    value={s.imageHeight || "260"}
                                    onChange={(e) => update("imageHeight", e.target.value)}
                                    className="erp-input text-xs py-1 text-center"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-gray-500">Object Fit</label>
                                <select
                                    value={s.objectFit || "cover"}
                                    onChange={(e) => update("objectFit", e.target.value)}
                                    className="erp-input text-xs py-1"
                                >
                                    <option value="cover">Cover</option>
                                    <option value="contain">Contain</option>
                                    <option value="fill">Fill</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. Background Color & Padding Presets */}
                <div className="flex flex-col gap-1.5">
                    <label className="erp-label">Background Color</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={s.backgroundColor || "#ffffff"}
                            onChange={(e) => update("backgroundColor", e.target.value)}
                            className="h-8 w-12 cursor-pointer rounded border border-gray-200 p-0.5 bg-white"
                        />
                        <input
                            type="text"
                            value={s.backgroundColor || ""}
                            onChange={(e) => update("backgroundColor", e.target.value)}
                            className="erp-input flex-1 text-xs"
                            placeholder="#ffffff"
                        />
                    </div>
                </div>

                {/* 5. Spacing (Margin & Padding) */}
                <div className="flex flex-col gap-2">
                    <label className="erp-label border-b border-gray-100 pb-1">Margin (px, outside space)</label>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-1.5"><span className="text-gray-400 w-10">Top</span><input type="number" value={s.marginTop || "0"} onChange={e => update("marginTop", e.target.value)} className="erp-input h-7 text-center text-xs" /></div>
                        <div className="flex items-center gap-1.5"><span className="text-gray-400 w-10">Right</span><input type="number" value={s.marginRight || "0"} onChange={e => update("marginRight", e.target.value)} className="erp-input h-7 text-center text-xs" /></div>
                        <div className="flex items-center gap-1.5"><span className="text-gray-400 w-10">Bottom</span><input type="number" value={s.marginBottom || "0"} onChange={e => update("marginBottom", e.target.value)} className="erp-input h-7 text-center text-xs" /></div>
                        <div className="flex items-center gap-1.5"><span className="text-gray-400 w-10">Left</span><input type="number" value={s.marginLeft || "0"} onChange={e => update("marginLeft", e.target.value)} className="erp-input h-7 text-center text-xs" /></div>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="erp-label border-b border-gray-100 pb-1">Padding (px, inside space)</label>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-1.5"><span className="text-gray-400 w-10">Top</span><input type="number" value={s.paddingTop || "16"} onChange={e => update("paddingTop", e.target.value)} className="erp-input h-7 text-center text-xs" /></div>
                        <div className="flex items-center gap-1.5"><span className="text-gray-400 w-10">Right</span><input type="number" value={s.paddingRight || "16"} onChange={e => update("paddingRight", e.target.value)} className="erp-input h-7 text-center text-xs" /></div>
                        <div className="flex items-center gap-1.5"><span className="text-gray-400 w-10">Bottom</span><input type="number" value={s.paddingBottom || "16"} onChange={e => update("paddingBottom", e.target.value)} className="erp-input h-7 text-center text-xs" /></div>
                        <div className="flex items-center gap-1.5"><span className="text-gray-400 w-10">Left</span><input type="number" value={s.paddingLeft || "16"} onChange={e => update("paddingLeft", e.target.value)} className="erp-input h-7 text-center text-xs" /></div>
                    </div>
                </div>

                {/* 6. Border Sides (Matching your screenshots) */}
                <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                    <label className="erp-label">Border Sides</label>
                    <div className="grid grid-cols-4 gap-1 text-[11px] font-semibold text-gray-600">
                        <label className="flex items-center gap-1 bg-gray-50 p-1.5 rounded border border-gray-200 cursor-pointer">
                            <input type="checkbox" checked={!!s.borderTop} onChange={e => update("borderTop", e.target.checked)} className="rounded text-emerald-600 h-3 w-3" /> Top
                        </label>
                        <label className="flex items-center gap-1 bg-gray-50 p-1.5 rounded border border-gray-200 cursor-pointer">
                            <input type="checkbox" checked={!!s.borderRight} onChange={e => update("borderRight", e.target.checked)} className="rounded text-emerald-600 h-3 w-3" /> Right
                        </label>
                        <label className="flex items-center gap-1 bg-gray-50 p-1.5 rounded border border-gray-200 cursor-pointer">
                            <input type="checkbox" checked={!!s.borderBottom} onChange={e => update("borderBottom", e.target.checked)} className="rounded text-emerald-600 h-3 w-3" /> Bottom
                        </label>
                        <label className="flex items-center gap-1 bg-gray-50 p-1.5 rounded border border-gray-200 cursor-pointer">
                            <input type="checkbox" checked={!!s.borderLeft} onChange={e => update("borderLeft", e.target.checked)} className="rounded text-emerald-600 h-3 w-3" /> Left
                        </label>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                        <div className="flex flex-col gap-1">
                            <label className="text-gray-400">Border Color</label>
                            <input type="color" value={s.borderColor || "#e5e7eb"} onChange={e => update("borderColor", e.target.value)} className="h-7 w-full cursor-pointer rounded border border-gray-200 p-0.5 bg-white" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-gray-400">Width (px)</label>
                            <input type="number" value={s.borderWidth || "1"} onChange={e => update("borderWidth", e.target.value)} className="erp-input h-7 text-center text-xs" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Delete Action */}
            <div className="p-3 border-t border-gray-100 bg-gray-50/70">
                <button
                    onClick={() => manager.requestDeleteBlock(activeBlock.id)}
                    className="w-full py-2 bg-white border border-red-200 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm"
                >
                    Delete block
                </button>
            </div>
        </div>
    );
}
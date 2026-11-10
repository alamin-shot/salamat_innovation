"use client";
import React, { memo } from "react";
import { WebhookEndpoint } from "@/types/integrations";
import { AlertTriangle, Plus, Server, Trash2, Power, Code, SearchX } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { ApiTokenCard } from "../components/ApiTokenCard";

// 1. Extracted Table Row
const WebhookRow = memo(({ row, isSelected, onToggle, onToggleStatus, onDelete }: any) => (
    <tr className="hover:bg-gray-50/50 transition-colors group border-b border-gray-100 last:border-none">
        <td className="p-4 w-12 text-center">
            <input type="checkbox" className="rounded border-gray-300 text-brand-primary" checked={isSelected} onChange={() => onToggle(row.id)} />
        </td>
        <td className="p-4">
            <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900">{row.url}</span>
                <span className="text-[11px] text-gray-400 mt-1 font-mono">{row.id}</span>
            </div>
        </td>
        <td className="p-4">
            <div className="flex flex-wrap gap-1.5">
                {row.subscribedEvents.map((evt: string) => (
                    <span key={evt} className="px-2 py-1 bg-gray-100/80 text-gray-600 text-[10px] font-bold rounded-md uppercase tracking-widest">{evt}</span>
                ))}
            </div>
        </td>
        <td className="p-4">
            <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase px-2.5 py-1.5 rounded-md ${row.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                <Server className="w-3 h-3" /> {row.status}
            </span>
        </td>
        <td className="p-4 text-right">
            <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon-sm" onClick={() => onToggleStatus(row.id)} className="hover:bg-gray-100">
                    <Power className={`w-4 h-4 ${row.status === "Active" ? "text-amber-500" : "text-emerald-500"}`} />
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={() => onDelete(row.id)} className="hover:bg-rose-50 hover:text-rose-600">
                    <Trash2 className="w-4 h-4 text-rose-400" />
                </Button>
            </div>
        </td>
    </tr>
));
WebhookRow.displayName = "WebhookRow";

// 2. The Master Assembler
export function DeveloperApiSpoke({ manager }: { manager: any }) {
    const creds = manager.store.apiCredentials;
    const webhooks = manager.paginatedData as WebhookEndpoint[];

    return (
        // The max-w-5xl ensures the layout never stretches too wide on massive monitors
        <div className="w-full max-w-5xl mx-auto flex flex-col gap-10 pb-8 animate-in fade-in duration-500">

            {/* Conditional Environment Banner */}
            {creds.environment === "sandbox" && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-4 shadow-sm">
                    <div className="bg-amber-100 p-2 rounded-lg shrink-0">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h4 className="text-sm font-black text-amber-900">Sandbox Environment Active</h4>
                        <p className="text-sm text-amber-700/90 leading-relaxed">Transactions generated with these keys will not affect live production data or inventory.</p>
                    </div>
                </div>
            )}

            {/* Separated Component: API Keys */}
            <ApiTokenCard
                creds={creds}
                onRegenerate={manager.store.regenerateApiKey}
                onToggleEnv={manager.store.toggleEnvironment}
            />

            <hr className="border-gray-200" />

            {/* Injected Webhooks Data Table */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-sm font-black text-gray-900">Webhook Endpoints</h3>
                        <p className="text-[11px] text-gray-500">URLs that receive real-time POST requests when events occur.</p>
                    </div>
                    <Button variant="default" size="sm" className="bg-gray-900 text-white hover:bg-gray-800 shadow-sm" onClick={() => manager.setDrawerMode("webhook_form")}>
                        <Plus className="w-4 h-4 mr-2" /> Add Endpoint
                    </Button>
                </div>

                <div className="flex flex-col border border-gray-200 rounded-xl shadow-sm overflow-hidden bg-white">
                    {manager.selectedIds.length > 0 && (
                        <div className="bg-gray-50 border-b border-gray-200 p-2">
                            <BulkActionBar selectedCount={manager.selectedIds.length} onClearSelection={() => manager.setSelectedIds([])}>
                                <Button variant="outline" size="sm" className="h-8 text-xs font-bold bg-white" onClick={() => { manager.selectedIds.forEach((id: string) => manager.store.toggleWebhookStatus(id)); manager.setSelectedIds([]); }}>
                                    <Power className="w-3.5 h-3.5 mr-1.5 text-gray-500" /> Toggle Status
                                </Button>
                                <Button variant="default" size="sm" className="bg-rose-500 text-white h-8 text-xs font-bold shadow-sm" onClick={() => { manager.store.deleteWebhooks(manager.selectedIds); manager.setSelectedIds([]); manager.setCurrentPage(1); }}>
                                    <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete Selected
                                </Button>
                            </BulkActionBar>
                        </div>
                    )}

                    {webhooks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-16 text-center">
                            <div className="w-16 h-16 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center mb-4">
                                <Code className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-base font-black text-gray-900">No Endpoints Registered</h3>
                            <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">Start listening for real-time events by adding a webhook URL.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto w-full">
                            <table className="w-full text-left border-collapse text-sm min-w-[800px]">
                                <thead className="bg-gray-50/50 border-b border-gray-200">
                                    <tr>
                                        <th className="p-4 w-12 text-center">
                                            <input type="checkbox" className="rounded border-gray-300 text-brand-primary" checked={manager.selectedIds.length === manager.activeTabData.length && manager.activeTabData.length > 0} onChange={() => manager.toggleSelection("ALL")} />
                                        </th>
                                        <th className="p-4 font-black text-[10px] text-gray-500 uppercase tracking-widest">Payload URL</th>
                                        <th className="p-4 font-black text-[10px] text-gray-500 uppercase tracking-widest">Subscribed Events</th>
                                        <th className="p-4 font-black text-[10px] text-gray-500 uppercase tracking-widest">Status</th>
                                        <th className="p-4 font-black text-[10px] text-gray-500 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {webhooks.map((row) => (
                                        <WebhookRow key={row.id} row={row} isSelected={manager.selectedIds.includes(row.id)} onToggle={manager.toggleSelection} onToggleStatus={manager.store.toggleWebhookStatus} onDelete={(id: string) => manager.store.deleteWebhooks([id])} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
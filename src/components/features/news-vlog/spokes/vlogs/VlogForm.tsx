import * as React from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import { StatusToggle } from "@/components/features/products-pages/shared/StatusToggle";
import { useVlogForm } from "@/hooks/vlog_hooks/useVlogForm";
import { Vlog } from "@/types/vlogs";
import { VlogPlayer } from "./VlogPlayer";

interface VlogFormProps {
    vlog: Vlog | null;
    onCancel: () => void;
    onSaved: () => void;
}

const INPUT = "w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500";
const LABEL = "text-[13px] font-medium text-gray-600";

export function VlogForm({ vlog, onCancel, onSaved }: VlogFormProps) {
    const { draft, set, submit } = useVlogForm(vlog, onSaved);

    return (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
            <div className="flex flex-col gap-5 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <label className="flex flex-col gap-1.5">
                    <span className={LABEL}>Title <span className="text-red-500">*</span></span>
                    <input className={INPUT} value={draft.title} onChange={(e) => set({ title: e.target.value })} />
                </label>
                <label className="flex flex-col gap-1.5">
                    <span className={LABEL}>Video URL <span className="text-red-500">*</span></span>
                    <input className={INPUT} value={draft.videoUrl} placeholder="https://www.youtube.com/watch?v=…" onChange={(e) => set({ videoUrl: e.target.value })} />
                    <span className="text-[11px] text-gray-400">YouTube and Vimeo links play inline; other links open in a new tab.</span>
                </label>
                <label className="flex flex-col gap-1.5">
                    <span className={LABEL}>Thumbnail URL</span>
                    <input className={INPUT} value={draft.thumbnail ?? ""} placeholder="https://…/cover.jpg (optional)" onChange={(e) => set({ thumbnail: e.target.value.trim() || null })} />
                </label>
                <label className="flex flex-col gap-1.5">
                    <span className={LABEL}>Description</span>
                    <textarea rows={4} className={`${INPUT} resize-none`} value={draft.description} onChange={(e) => set({ description: e.target.value })} />
                </label>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                        <span className={LABEL}>Publish Date <span className="text-red-500">*</span></span>
                        <DatePicker value={draft.publishDate} onChange={(value) => set({ publishDate: value })} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <span className={LABEL}>Status</span>
                        <div className="flex h-9 items-center">
                            <StatusToggle checked={draft.status === "Active"} onChange={() => set({ status: draft.status === "Active" ? "Inactive" : "Active" })} label={draft.status} />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                    <Button variant="outline" onClick={onCancel} className="px-6">Cancel</Button>
                    <Button variant="success" onClick={submit} className="gap-2 px-6"><Save className="h-4 w-4" /> {vlog ? "Update Vlog" : "Publish Vlog"}</Button>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Live preview</p>
                <VlogPlayer videoUrl={draft.videoUrl} title={draft.title} />
            </div>
        </div>
    );
}

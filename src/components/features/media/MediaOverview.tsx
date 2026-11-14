import { FileText, Film, FolderLock, Folders, HardDrive, Image as ImageIcon, type LucideIcon } from "lucide-react";
import { MediaFileType, MediaStats } from "@/types/media";
import { MEDIA_TYPE_LABELS } from "@/constants/media";
import { formatBytes } from "@/utils/mediaRules";

const TYPE_ICON: Record<MediaFileType, LucideIcon> = { image: ImageIcon, pdf: FileText, video: Film };
const TYPE_TONE: Record<MediaFileType, string> = { image: "bg-emerald-50 text-emerald-600", pdf: "bg-blue-50 text-blue-600", video: "bg-violet-50 text-violet-600" };

/** Storage KPIs + file categories for the landing view (no files listed until a folder / filter is chosen). */
export function MediaOverview({ stats, onPickType }: { stats: MediaStats; onPickType: (type: MediaFileType) => void }) {
    const kpis: { label: string; value: string; icon: LucideIcon }[] = [
        { label: "Total Storage", value: formatBytes(stats.totalBytes), icon: HardDrive },
        { label: "Files", value: String(stats.totalFiles), icon: FileText },
        { label: "Folders", value: String(stats.folders), icon: Folders },
        { label: "Locked Folders", value: String(stats.lockedFolders), icon: FolderLock },
    ];
    const largest = Math.max(1, ...Object.values(stats.byType).map((entry) => entry.bytes));

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {kpis.map((kpi) => (
                    <div key={kpi.label} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-500"><kpi.icon className="h-5 w-5" /></div>
                        <div className="min-w-0">
                            <span className="block text-xs font-medium text-gray-500">{kpi.label}</span>
                            <span className="block text-lg font-bold tabular-nums text-gray-900">{kpi.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Categories</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {(Object.keys(MEDIA_TYPE_LABELS) as MediaFileType[]).map((type) => {
                        const Icon = TYPE_ICON[type];
                        const entry = stats.byType[type];
                        return (
                            <button key={type} type="button" onClick={() => onPickType(type)} className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-primary/30 hover:shadow-md">
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${TYPE_TONE[type]}`}><Icon className="h-5 w-5" /></div>
                                    <div>
                                        <span className="block text-sm font-semibold text-gray-800">{MEDIA_TYPE_LABELS[type]}</span>
                                        <span className="text-xs text-gray-500">{entry.count} file{entry.count === 1 ? "" : "s"} · {formatBytes(entry.bytes)}</span>
                                    </div>
                                </div>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                                    <div className="h-full rounded-full bg-brand-primary/70" style={{ width: `${Math.round((entry.bytes / largest) * 100)}%` }} />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

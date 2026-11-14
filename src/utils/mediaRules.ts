import { MediaFile, MediaFileType, MediaFolder, MediaStats, SessionRole } from "@/types/media";

/** "1.2 MB" / "450 KB" → bytes (for records saved before sizes were numbers). */
export function parseSizeLabel(label: string): number {
    const match = label.trim().match(/^([\d.]+)\s*(B|KB|MB|GB)$/i);
    if (!match) return 0;
    const power = ["B", "KB", "MB", "GB"].indexOf(match[2].toUpperCase());
    return Math.round(Number(match[1]) * 1024 ** power);
}

/** bytes → "1.2 MB" */
export function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    const units = ["KB", "MB", "GB", "TB"];
    let value = bytes / 1024;
    let unit = 0;
    while (value >= 1024 && unit < units.length - 1) { value /= 1024; unit += 1; }
    return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unit]}`;
}

/** The folder and every folder above it, nearest first. */
export function folderChain(folders: MediaFolder[], folderId: string | null): MediaFolder[] {
    const chain: MediaFolder[] = [];
    let current = folderId;
    const seen = new Set<string>();
    while (current && !seen.has(current)) {
        seen.add(current);
        const folder = folders.find((candidate) => candidate.id === current);
        if (!folder) break;
        chain.push(folder);
        current = folder.parentId;
    }
    return chain;
}

/** A folder is locked when it, or any folder above it, is locked. */
export const isFolderLocked = (folders: MediaFolder[], folderId: string | null) => folderChain(folders, folderId).some((folder) => folder.isLocked);

/**
 * Super Admin opens everything. Other roles need every locked folder on the way down to have been
 * unlocked with the PIN in this session.
 */
export function canOpenFolder(folders: MediaFolder[], folderId: string | null, role: SessionRole, unlockedIds: string[]): boolean {
    if (role === "Super Admin") return true;
    return folderChain(folders, folderId).every((folder) => !folder.isLocked || unlockedIds.includes(folder.id));
}

/** The locked folder that blocks access (nearest to the top), or null. */
export function blockingFolder(folders: MediaFolder[], folderId: string | null, role: SessionRole, unlockedIds: string[]): MediaFolder | null {
    if (role === "Super Admin") return null;
    const blocked = folderChain(folders, folderId).filter((folder) => folder.isLocked && !unlockedIds.includes(folder.id));
    return blocked[blocked.length - 1] ?? null;
}

/** Ids of the folder and everything under it. */
export function descendantIds(folders: MediaFolder[], folderId: string): string[] {
    const ids = [folderId];
    for (let index = 0; index < ids.length; index++) {
        folders.filter((folder) => folder.parentId === ids[index]).forEach((child) => ids.push(child.id));
    }
    return ids;
}

const EMPTY = (): Record<MediaFileType, { count: number; bytes: number }> => ({ image: { count: 0, bytes: 0 }, pdf: { count: 0, bytes: 0 }, video: { count: 0, bytes: 0 } });

/** Storage KPIs for the landing view. */
export function mediaStats(folders: MediaFolder[], files: MediaFile[]): MediaStats {
    const byType = EMPTY();
    files.forEach((file) => { byType[file.type].count += 1; byType[file.type].bytes += file.sizeBytes; });
    return {
        totalFiles: files.length,
        totalBytes: files.reduce((sum, file) => sum + file.sizeBytes, 0),
        byType,
        folders: folders.length,
        lockedFolders: folders.filter((folder) => folder.isLocked).length,
    };
}

import { useState } from "react";
import { toast } from "sonner";
import { useVlogStore } from "@/store/useVlogStore";
import { Vlog, VlogError, VlogInput } from "@/types/vlogs";
import { toVlogEmbedUrl } from "@/utils/vlogRules";

const VLOG_ERRORS: Record<VlogError, string> = {
    title_required: "Title is required.",
    video_url_invalid: "Video URL must be a full http(s) link.",
    publish_date_required: "Publish date is required.",
    not_found: "This vlog no longer exists.",
};

const EMPTY: VlogInput = { title: "", videoUrl: "", thumbnail: null, description: "", status: "Active", publishDate: new Date().toISOString().slice(0, 10) };

/** Add / Edit Vlog form. Mounted with `key={vlog?.id ?? "new"}` so it starts from the record. */
export function useVlogForm(vlog: Vlog | null, onSaved: () => void) {
    const addVlog = useVlogStore((state) => state.addVlog);
    const updateVlog = useVlogStore((state) => state.updateVlog);
    const [draft, setDraft] = useState<VlogInput>(vlog ? { title: vlog.title, videoUrl: vlog.videoUrl, thumbnail: vlog.thumbnail, description: vlog.description, status: vlog.status, publishDate: vlog.publishDate } : EMPTY);

    const set = (changes: Partial<VlogInput>) => setDraft((prev) => ({ ...prev, ...changes }));

    const submit = () => {
        const result = vlog ? updateVlog(vlog.id, draft) : addVlog(draft);
        if (!result.ok) {
            toast.error(VLOG_ERRORS[result.error]);
            return;
        }
        toast.success(vlog ? "Vlog updated." : "Vlog published.");
        onSaved();
    };

    return { draft, set, submit, embedUrl: toVlogEmbedUrl(draft.videoUrl) };
}

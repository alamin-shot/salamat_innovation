import * as React from "react";
import { ExternalLink, PlayCircle } from "lucide-react";
import { toVlogEmbedUrl } from "@/utils/vlogRules";

/** Embedded YouTube / Vimeo player, or a plain link for other hosts. */
export function VlogPlayer({ videoUrl, title }: { videoUrl: string; title: string }) {
    const embedUrl = toVlogEmbedUrl(videoUrl);

    if (!embedUrl) {
        return (
            <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-center">
                <PlayCircle className="h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-500">No inline preview for this host.</p>
                {videoUrl && (
                    <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm font-semibold text-brand-primary hover:underline">
                        Open video <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                )}
            </div>
        );
    }

    return (
        <iframe
            src={embedUrl}
            title={title || "Vlog preview"}
            className="aspect-video w-full rounded-xl border border-gray-200 bg-black"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
        />
    );
}

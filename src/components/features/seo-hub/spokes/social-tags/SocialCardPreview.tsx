import * as React from "react";
import { ImageOff } from "lucide-react";

interface SocialCardPreviewProps {
    image: string | null;
    title: string;
    domain: string;
    handle: string;
}

/** Approximate link card for Facebook / X when a page is shared. */
export function SocialCardPreview({ image, title, domain, handle }: SocialCardPreviewProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <p className="px-4 pt-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">Shared link preview</p>
            <div className="mt-2 flex aspect-[1.91/1] items-center justify-center bg-gray-100">
                {image ? (
                    // eslint-disable-next-line @next/next/no-img-element -- admin-entered external URL; next/image would need every host whitelisted
                    <img src={image} alt="" className="h-full w-full object-cover" />
                ) : (
                    <span className="flex flex-col items-center gap-1 text-[12px] text-gray-400"><ImageOff className="h-6 w-6" /> No share image</span>
                )}
            </div>
            <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
                <p className="truncate text-[11px] uppercase text-gray-500">{domain.replace(/^https?:\/\//, "") || "your-domain"}</p>
                <p className="truncate text-[14px] font-semibold text-gray-800">{title}</p>
                {handle && <p className="text-[11px] text-gray-500">via {handle}</p>}
            </div>
        </div>
    );
}

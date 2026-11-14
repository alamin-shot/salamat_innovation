"use client";
import { ExternalLink, VideoOff } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { ReelsManagerType } from "@/hooks/reels_hooks/useReelsManager";
import { parseVideoLink, VIDEO_LINK_LABEL } from "@/utils/videoLinks";

/** Watch a reel and inspect its details. */
export function ReelPreviewDrawer({ manager }: { manager: ReelsManagerType }) {
    const reel = manager.getActiveReel();
    const isOpen = manager.activeDrawer === "view";
    const info = parseVideoLink(reel?.videoLink);

    return (
        <Drawer title="Reels Video" isOpen={isOpen} onClose={manager.closeDrawer} width="w-full sm:w-[calc(100vw-260px)]">
            {reel && (
                <div className="flex min-h-full flex-col gap-6 bg-gray-50/50 p-4 pb-32 lg:flex-row">
                    {/* Player: vertical reel frame */}
                    <div className="mx-auto flex w-full max-w-sm shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gray-900 shadow-lg aspect-[9/16]">
                        {isOpen && info.kind === "youtube" && (
                            <iframe src={info.embedUrl} title={reel.productName} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                        )}
                        {isOpen && info.kind === "facebook" && (
                            <iframe src={info.embedUrl} title={reel.productName} className="h-full w-full" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture" allowFullScreen />
                        )}
                        {isOpen && info.kind === "file" && (
                            <video src={info.src} controls playsInline className="h-full w-full object-contain">
                                <track kind="captions" />
                            </video>
                        )}
                        {info.kind === "invalid" && (
                            <div className="flex flex-col items-center gap-2 p-6 text-center text-gray-400">
                                <VideoOff className="h-10 w-10" />
                                <span className="text-sm font-semibold">{reel.videoLink ? "This link can't be played" : "No video link yet"}</span>
                                <span className="text-xs">Add a YouTube, Facebook or video file link from Edit.</span>
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col gap-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Product</span>
                            <h2 className="text-xl font-bold text-gray-900">{reel.productName}</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="block text-xs font-bold uppercase tracking-wider text-gray-400">Status</span>
                                <span className={`mt-1 inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${reel.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>{reel.status}</span>
                            </div>
                            <div>
                                <span className="block text-xs font-bold uppercase tracking-wider text-gray-400">Source</span>
                                <span className="mt-1 block font-medium text-gray-700">{reel.videoLink ? VIDEO_LINK_LABEL[info.kind] : "—"}</span>
                            </div>
                        </div>
                        <div>
                            <span className="block text-xs font-bold uppercase tracking-wider text-gray-400">Video link</span>
                            {reel.videoLink ? (
                                <a href={reel.videoLink} target="_blank" rel="noreferrer" className="mt-1 inline-flex max-w-full items-center gap-1.5 break-all text-sm font-medium text-blue-600 hover:underline">
                                    {reel.videoLink} <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                                </a>
                            ) : (
                                <span className="mt-1 block text-sm text-gray-500">Not set</span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Drawer>
    );
}

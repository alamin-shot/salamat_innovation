"use client";
import { ProductVerifyManagerType } from "@/hooks/product_verify_hooks/useProductVerifyManager";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Paperclip } from "lucide-react";

export function ProductVerifyDrawer({ manager }: { manager: ProductVerifyManagerType }) {
    const activeRequest = manager.getActiveRequest();

    if (!activeRequest) return null;

    return (
        <Drawer
            title="Product Verify Details"
            isOpen={manager.isDrawerOpen}
            onClose={manager.closeDrawer}
            width="w-full sm:w-[calc(100vw-260px)] md:w-[600px]"
        >
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 w-full flex flex-col gap-6 px-4 overflow-y-auto custom-scrollbar pb-10">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-6">

                        <div className="sm:col-span-2">
                            <span className="text-xs text-gray-500 font-semibold">Product Name:</span>
                            <p className="text-sm font-medium text-gray-900 mt-1">{activeRequest.productName}</p>
                        </div>

                        <div>
                            <span className="text-xs text-gray-500 font-semibold">Shop Name:</span>
                            <p className="text-sm text-gray-800 mt-1">{activeRequest.shopName}</p>
                        </div>

                        <div>
                            <span className="text-xs text-gray-500 font-semibold">QR Code Number:</span>
                            <p className="text-sm text-gray-800 mt-1 font-mono bg-gray-100 inline-block px-1.5 py-0.5 rounded">{activeRequest.qrCode}</p>
                        </div>

                        <div>
                            <span className="text-xs text-gray-500 font-semibold">Verified Date:</span>
                            <p className="text-sm text-gray-800 mt-1">{new Date(activeRequest.verifiedDate).toLocaleDateString('en-GB').replace(/\//g, '-')}</p>
                        </div>

                        <div>
                            <span className="text-xs text-gray-500 font-semibold">User Name:</span>
                            <p className="text-sm text-gray-800 mt-1">{activeRequest.userName}</p>
                        </div>

                        <div>
                            <span className="text-xs text-gray-500 font-semibold">Phone:</span>
                            <p className="text-sm text-gray-800 mt-1">{activeRequest.phone}</p>
                        </div>

                        <div className="sm:col-span-2">
                            <span className="text-xs text-gray-500 font-semibold">Full Address:</span>
                            <p className="text-sm text-gray-800 mt-1">{activeRequest.fullAddress || '-'}</p>
                        </div>

                        <div className="sm:col-span-2">
                            <span className="text-xs text-gray-500 font-semibold mb-2 block">Attachments:</span>
                            {activeRequest.attachmentUrl ? (
                                <a
                                    href={activeRequest.attachmentUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 text-sm text-brand-primary hover:underline"
                                >
                                    <Paperclip className="h-4 w-4" />
                                    Download Attachment
                                </a>
                            ) : (
                                <span className="text-sm text-gray-400 italic">No attachments provided</span>
                            )}
                        </div>

                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white mt-auto shrink-0 px-4">
                    <Button variant="outline" onClick={manager.closeDrawer} className="px-6 h-9">Close</Button>
                </div>
            </div>
        </Drawer>
    );
}
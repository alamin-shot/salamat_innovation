"use client";
import { useState, useEffect } from "react";
import { ReviewManagerType } from "@/hooks/review_hooks/useReviewManager";
import { ReviewStatus } from "@/store/useReviewStore";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Star } from "lucide-react";

export function ReviewDrawer({ manager }: { manager: ReviewManagerType }) {
    const isEditing = manager.activeDrawer === "edit";
    const activeReview = manager.getActiveReview();

    const [reply, setReply] = useState("");
    const [status, setStatus] = useState<ReviewStatus>("Pending");

    useEffect(() => {
        if (isEditing && activeReview) {
            setReply(activeReview.reply || "");
            setStatus(activeReview.status);
        }
    }, [isEditing, activeReview]);

    const handleSubmit = () => {
        manager.handleSubmit({
            reply: reply.trim() === "" ? null : reply,
            status
        });
    };

    if (!activeReview) return null;

    return (
        <Drawer
            title="Review Details & Reply"
            isOpen={manager.activeDrawer !== "none"}
            onClose={manager.closeDrawer}
            width="w-full sm:w-[calc(100vw-260px)] md:w-[600px]"
        >
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 w-full flex flex-col gap-6 px-4 overflow-y-auto custom-scrollbar pb-10">

                    {/* Customer Context (Read Only) */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 flex flex-col gap-3">
                        <div>
                            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Product</span>
                            <p className="text-sm font-medium text-gray-900">{activeReview.productName}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Customer</span>
                                <p className="text-sm text-gray-800">{activeReview.customerName}</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Rating</span>
                                <div className="flex items-center gap-0.5 mt-0.5">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <Star
                                            key={star}
                                            className={`h-4 w-4 ${star <= activeReview.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div>
                            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Comment</span>
                            <p className="text-sm text-gray-700 mt-1 bg-white p-3 rounded border border-gray-100 italic">
                                "{activeReview.comment}"
                            </p>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Admin Actions */}
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Admin Reply</label>
                        <textarea
                            className="erp-input h-32 resize-none"
                            placeholder="Type a public reply to the customer..."
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                        />
                        <span className="text-xs text-gray-400">This reply will be visible publicly on the product page.</span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Visibility Status <span className="text-red-500">*</span></label>
                        <CustomSelect
                            value={status}
                            options={["Pending", "Approved", "Rejected"]}
                            onChange={(val) => setStatus(val as ReviewStatus)}
                        />
                    </div>

                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white mt-auto shrink-0 px-4">
                    <Button variant="outline" onClick={manager.closeDrawer} className="px-6 h-9">Cancel</Button>
                    <Button variant="success" onClick={handleSubmit} className="px-8 h-9">Save Changes</Button>
                </div>
            </div>
        </Drawer>
    );
}
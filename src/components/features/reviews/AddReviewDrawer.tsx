"use client";
import Image from "next/image";
import { BadgeCheck, ImagePlus, X } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { ReviewManagerType } from "@/hooks/review_hooks/useReviewManager";
import { useAddReviewForm } from "@/hooks/review_hooks/useAddReviewForm";
import { REVIEW_MAX_PHOTOS, REVIEW_STATUSES } from "@/constants/reviews";
import { StarRatingInput } from "./StarRating";

function AddReviewForm({ onClose }: { onClose: () => void }) {
    const form = useAddReviewForm(onClose);

    return (
        <div className="flex min-h-full flex-col pt-6">
            <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-4 pb-32">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Product <span className="text-red-500">*</span></label>
                        <CustomSelect value={form.productId} onChange={form.setProductId} options={form.productOptions} placeholder="Choose a product" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Customer <span className="text-red-500">*</span></label>
                        <CustomSelect value={form.customerId} onChange={form.setCustomerId} options={form.customerOptions} placeholder="Choose a customer" />
                    </div>
                </div>

                {form.productId && form.customerId && (
                    <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${form.verified ? "bg-emerald-50 text-emerald-700" : "bg-gray-50 text-gray-500"}`}>
                        <BadgeCheck className="h-4 w-4" />
                        {form.verified ? "Verified buyer: Sales shows this customer bought this product." : "Not a verified buyer: no sale of this product to this customer."}
                    </div>
                )}

                <div className="flex flex-col gap-1.5">
                    <label className="erp-label">Rating <span className="text-red-500">*</span></label>
                    <StarRatingInput value={form.rating} onChange={form.setRating} />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="erp-label">Comment <span className="text-red-500">*</span></label>
                    <textarea className="erp-input h-32 resize-none" value={form.comment} onChange={(e) => form.setComment(e.target.value)} placeholder="What did the customer say about the product?" />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="erp-label">Customer Photos <span className="font-normal text-gray-400">(up to {REVIEW_MAX_PHOTOS})</span></label>
                    <div className="flex flex-wrap gap-3">
                        {form.photos.map((src, index) => (
                            <div key={index} className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200">
                                <Image src={src} alt={`Customer photo ${index + 1}`} fill unoptimized className="object-cover" />
                                <button type="button" onClick={() => form.removePhoto(index)} title="Remove photo" className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white/90 text-rose-600 shadow">
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                        {form.photos.length < REVIEW_MAX_PHOTOS && (
                            <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 text-gray-400 transition-colors hover:border-emerald-400">
                                <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => { form.addPhotos(e.target.files); e.target.value = ""; }} />
                                <ImagePlus className="h-6 w-6" />
                                <span className="text-[10px] font-medium">Add photo</span>
                            </label>
                        )}
                    </div>
                </div>

                <div className="flex w-full flex-col gap-1.5 sm:w-1/2">
                    <label className="erp-label">Visibility Status <span className="text-red-500">*</span></label>
                    <CustomSelect value={form.status} onChange={form.setStatus} options={REVIEW_STATUSES} />
                </div>
            </div>

            <div className="sticky bottom-0 mt-auto flex shrink-0 justify-end gap-3 border-t border-gray-100 bg-white px-4 pt-4">
                <Button variant="outline" onClick={onClose} className="h-9 px-6">Cancel</Button>
                <Button variant="success" onClick={form.save} className="h-9 px-8">Add Review</Button>
            </div>
        </div>
    );
}

export function AddReviewDrawer({ manager }: { manager: ReviewManagerType }) {
    const isOpen = manager.activeDrawer === "add";
    return (
        <Drawer title="Add Review" isOpen={isOpen} onClose={manager.closeDrawer} width="w-full sm:w-[calc(100vw-260px)]">
            {isOpen && <AddReviewForm onClose={manager.closeDrawer} />}
        </Drawer>
    );
}

"use client";
import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductFormData } from "@/schemas/product";
import { FormInput } from "@/components/ui/forms/FormInput";
import { FormSelect } from "@/components/ui/forms/FormSelect";
import { ImageDropzone } from "@/components/ui/forms/ImageDropzone";
import { VariantsManager } from "@/components/features/products/VariantsManager";
import { RichTextEditor } from "@/components/ui/forms/RichTextEditor";

export function ProductForm() {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting }
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema)
    });

    const onSubmit = async (data: ProductFormData) => {
        // RTK Query mutation will go here
        console.log("Validated Form Data:", data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">

                {/* LEFT COLUMN: Main Information */}
                <div className="flex flex-col gap-6 lg:col-span-2">

                    <div className="rounded-xl border border-brand-subtext/20 bg-white p-5 shadow-sm">
                        <h3 className="mb-4 text-sm font-bold text-brand-text">Product Information</h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormInput
                                label="Name"
                                required
                                error={errors.name?.message}
                                {...register("name")}
                            />
                            <FormInput
                                label="Headline"
                                {...register("headline")}
                            />
                            <FormSelect
                                label="Brand"
                                options={[
                                    { label: "VIVO", value: "vivo" },
                                    { label: "Apple", value: "apple" }
                                ]}
                                placeholder="Choose a Brand"
                                {...register("brandId")}
                            />
                            <FormSelect
                                label="Category"
                                required
                                options={[{ label: "Smart Phones", value: "smartphones" }]}
                                placeholder="Choose a category"
                                error={errors.categoryId?.message}
                                {...register("categoryId")}
                            />
                        </div>

                        <div className="mt-4">
                            <Controller
                                name="keyFeatures"
                                control={control}
                                render={({ field }) => (
                                    <RichTextEditor
                                        label="Key Features"
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                        error={errors.keyFeatures?.message}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div className="rounded-xl border border-brand-subtext/20 bg-white p-5 shadow-sm">
                        <h3 className="mb-4 text-sm font-bold text-brand-text">Product Variants</h3>
                        <VariantsManager />
                    </div>
                </div>

                {/* RIGHT COLUMN: Media & Metadata */}
                <div className="flex flex-col gap-6 lg:col-span-1">

                    <div className="rounded-xl border border-brand-subtext/20 bg-white p-5 shadow-sm">
                        <h3 className="mb-4 text-sm font-bold text-brand-text">Product Image</h3>
                        <ImageDropzone
                            label="Thumbnail Image"
                            onFileSelect={(file) => console.log("Thumbnail selected:", file)}
                        />
                        <div className="mt-5">
                            <ImageDropzone
                                label="Video Links"
                                accept="video/*"
                                onFileSelect={(file) => console.log("Video selected:", file)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 rounded-xl border border-brand-subtext/20 bg-white p-5 shadow-sm">
                        <div className="grid grid-cols-2 gap-4">
                            <FormInput
                                label="Booking Money"
                                type="number"
                                {...register("bookingMoney")}
                            />
                            <FormInput
                                label="Purchase Point"
                                type="number"
                                {...register("purchasePoint")}
                            />
                        </div>
                        <FormInput
                            label="Warranty Text"
                            {...register("warrantyText")}
                        />
                        <FormInput
                            label="Service Warranty"
                            {...register("serviceWarranty")}
                        />
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <div className="flex justify-end border-t border-brand-subtext/20 pt-4 pb-2">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-md bg-green-600 px-8 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                >
                    {isSubmitting ? "Saving..." : "Save"}
                </button>
            </div>
        </form>
    );
}
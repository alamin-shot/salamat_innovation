import * as React from "react";
import Image from "next/image";

interface VariantSwatchProps {
    title: string;
    /** The colour value's image from the builder's Variant Image section. */
    image: string | null;
}

/** Round thumbnail beside the variant title; the title's first letter when no colour image is set. */
export const VariantSwatch = React.memo(function VariantSwatch({ title, image }: VariantSwatchProps) {
    if (image) {
        return (
            <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-brand-subtext/20 bg-brand-bg">
                <Image src={image} alt={title} fill sizes="32px" className="object-cover" />
            </span>
        );
    }
    return (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold uppercase text-white" aria-hidden="true">
            {title.trim().charAt(0) || "?"}
        </span>
    );
});

VariantSwatch.displayName = "VariantSwatch";

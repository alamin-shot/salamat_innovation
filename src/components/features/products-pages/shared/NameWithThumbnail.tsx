"use client";
import * as React from "react";
import Image from "next/image";

interface NameWithThumbnailProps {
    name: string;
    image: string | null | undefined;
    /** Extra content rendered after the name (e.g. an inline edit button). */
    children?: React.ReactNode;
}

/** Name column cell: thumbnail preview followed by the record name. */
export const NameWithThumbnail = React.memo(function NameWithThumbnail({ name, image, children }: NameWithThumbnailProps) {
    const initial = name.trim().charAt(0).toUpperCase() || "?";

    return (
        <div className="flex items-center gap-3">
            <div className="relative h-8 w-8 overflow-hidden rounded-md border border-brand-subtext/15 bg-brand-bg shrink-0">
                {image ? (
                    <Image src={image} alt={name} fill sizes="32px" className="object-contain p-1" />
                ) : (
                    <span className="flex h-full w-full items-center justify-center text-xs font-bold text-brand-subtext">
                        {initial}
                    </span>
                )}
            </div>
            <span className="font-medium text-brand-text">{name}</span>
            {children}
        </div>
    );
});

NameWithThumbnail.displayName = "NameWithThumbnail";

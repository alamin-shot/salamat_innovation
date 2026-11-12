"use client";
import { useState } from "react";

/**
 * Returns `value` while `isActive`, and the last active value afterwards.
 * Lets a drawer keep showing its record during the slide-out animation,
 * after the URL has already dropped the record id.
 */
export function useRetainedValue<T>(value: T, isActive: boolean): T {
    const [retained, setRetained] = useState<T>(value);

    if (isActive && retained !== value) {
        setRetained(value);
    }

    return isActive ? value : retained;
}

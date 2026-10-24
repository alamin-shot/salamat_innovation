"use client";
import { useEffect, useState, ReactNode } from "react";

export function StoreProvider({ children }: { children: ReactNode }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return <>{children}</>;
}
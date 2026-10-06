import * as React from "react";
import { Wrench } from "lucide-react";

interface ComingSoonProps {
    searchParams: { p?: string };
}

export default function ComingSoonPage({ searchParams }: ComingSoonProps) {
    // Extract and format the 'p' query param (e.g., 'stock-transfer' -> 'STOCK TRANSFER')
    const pageName = searchParams.p
        ? searchParams.p.replace(/-/g, " ").toUpperCase()
        : "THIS MODULE";

    return (
        <div className="flex h-[75vh] flex-col items-center justify-center p-6 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
                <Wrench className="h-10 w-10" />
            </div>
            <h1 className="text-3xl font-bold text-brand-text">Under Construction</h1>
            <p className="mt-4 max-w-md text-brand-subtext leading-relaxed">
                The <strong className="text-brand-primary font-semibold">{pageName}</strong> interface is currently being built.
                It will be available in a future phase of the Admin Panel rollout.
            </p>
        </div>
    );
}
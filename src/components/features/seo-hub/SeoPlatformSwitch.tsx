import * as React from "react";
import { motion } from "framer-motion";
import { SeoPlatform } from "@/types/seo";
import { SEO_PLATFORM_LABELS, SEO_PLATFORMS } from "@/constants/seo";

interface SeoPlatformSwitchProps {
    platform: SeoPlatform;
    onChange: (platform: SeoPlatform) => void;
}

/** Salamat / TEKZO master switch in the SEO hub header; every spoke follows it. */
export function SeoPlatformSwitch({ platform, onChange }: SeoPlatformSwitchProps) {
    return (
        <div role="radiogroup" aria-label="Storefront" className="flex rounded-xl border border-brand-subtext/20 bg-white p-1 shadow-sm">
            {SEO_PLATFORMS.map((option) => {
                const isActive = option === platform;
                return (
                    <button
                        key={option}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        onClick={() => onChange(option)}
                        className={`relative rounded-lg px-4 py-1.5 text-sm font-bold transition-colors ${isActive ? "text-white" : "text-brand-subtext hover:text-brand-text"}`}
                    >
                        {isActive && (
                            <motion.span layoutId="seo-platform-pill" className="absolute inset-0 rounded-lg bg-brand-primary" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
                        )}
                        <span className="relative">{SEO_PLATFORM_LABELS[option]}</span>
                    </button>
                );
            })}
        </div>
    );
}

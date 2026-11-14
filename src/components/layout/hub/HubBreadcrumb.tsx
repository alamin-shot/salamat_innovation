import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { HubBackLink } from "@/types/hub";

/** "SEO › Page Metadata › Pages": every level but the last is a link. */
export function HubBreadcrumb({ links, current }: { links: HubBackLink[]; current: string }) {
    return (
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-brand-subtext">
            {links.map((link) => (
                <span key={link.href} className="flex items-center gap-1.5">
                    <Link href={link.href} className="font-medium transition-colors hover:text-brand-primary">{link.title}</Link>
                    <ChevronRight className="h-3 w-3" />
                </span>
            ))}
            <span className="font-semibold text-brand-text">{current}</span>
        </nav>
    );
}

import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PageContainerProps } from "@/types/layout";

export function PageContainer({ title, breadcrumbs, action, children }: PageContainerProps) {
    return (
        <div className="flex h-full flex-col gap-6 animate-in fade-in duration-500">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div className="flex flex-col gap-1.5">
                    <h1 className="text-2xl font-bold tracking-tight text-brand-text">
                        {title}
                    </h1>

                    {breadcrumbs && breadcrumbs.length > 0 && (
                        <nav className="flex items-center text-sm text-brand-subtext">
                            {breadcrumbs.map((crumb, index) => (
                                <React.Fragment key={crumb.label}>
                                    {crumb.href ? (
                                        <Link
                                            href={crumb.href}
                                            className="transition-colors hover:text-brand-primary"
                                        >
                                            {crumb.label}
                                        </Link>
                                    ) : (
                                        <span className="font-medium text-brand-text">
                                            {crumb.label}
                                        </span>
                                    )}

                                    {index < breadcrumbs.length - 1 && (
                                        <ChevronRight className="mx-1 h-3.5 w-3.5 opacity-50" />
                                    )}
                                </React.Fragment>
                            ))}
                        </nav>
                    )}
                </div>

                {action && (
                    <div className="flex shrink-0 items-center gap-3">
                        {action}
                    </div>
                )}
            </div>

            <div className="flex-1 rounded-xl border border-brand-subtext/20 bg-white shadow-sm overflow-hidden">
                {children}
            </div>
        </div>
    );
}
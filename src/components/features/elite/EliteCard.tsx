"use client";
import { EliteTier } from "@/store/useEliteStore";
import { Button } from "@/components/ui/Button";
import { Edit, Trash2, Shield } from "lucide-react";

interface EliteCardProps {
    tier: EliteTier;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export function EliteCard({ tier, onEdit, onDelete }: EliteCardProps) {

    const getBgGradient = (name: string) => {
        const lower = name.toLowerCase();
        if (lower.includes("platinum")) return "bg-gradient-to-br from-slate-800 to-slate-900";
        if (lower.includes("gold")) return "bg-gradient-to-br from-yellow-900 to-slate-900";
        if (lower.includes("silver")) return "bg-gradient-to-br from-zinc-800 to-zinc-900";
        if (lower.includes("bronze")) return "bg-gradient-to-br from-orange-950 to-slate-900";
        return "bg-gradient-to-br from-gray-800 to-gray-900";
    };

    return (
        <div className={`relative rounded-xl overflow-hidden shadow-sm flex flex-col ${getBgGradient(tier.name)} text-white h-48 border border-gray-800/50`}>
            {/* Background Pattern overlay (optional for depth) */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />

            <div className="relative p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-2xl font-bold tracking-wide">{tier.name}</h3>
                        <p className="text-sm text-gray-300 font-medium mt-1">{tier.tagline}</p>
                    </div>

                    {/* Placeholder for Logo/Badge */}
                    <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
                        {tier.logo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={tier.logo} alt={tier.name} className="h-8 w-8 object-contain" />
                        ) : (
                            <Shield className="h-6 w-6 text-white/70" />
                        )}
                    </div>
                </div>

                <div className="mt-auto flex items-end justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Required Points</span>
                        <span className="text-lg font-semibold">{tier.points.toLocaleString()}</span>
                    </div>

                    {/* Standardized Action Buttons */}
                    <div className="flex items-center gap-1 bg-black/20 rounded-lg p-1 backdrop-blur-sm">
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-white hover:bg-white/20 hover:text-white"
                            title="Edit Tier"
                            onClick={() => onEdit(tier.id)}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-red-400 hover:bg-red-500/20 hover:text-red-300"
                            title="Delete Tier"
                            onClick={() => onDelete(tier.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
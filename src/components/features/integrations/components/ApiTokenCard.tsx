"use client";
import React, { useState } from "react";
import { Code, Copy, Check, RefreshCw, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ApiTokenCard({ creds, onRegenerate, onToggleEnv }: { creds: any, onRegenerate: () => void, onToggleEnv: (env: string) => void }) {
    const [copiedId, setCopiedId] = useState(false);
    const [copiedSecret, setCopiedSecret] = useState(false);
    const [isSecretRevealed, setIsSecretRevealed] = useState(false);

    const handleCopy = (text: string, type: "id" | "secret") => {
        navigator.clipboard.writeText(text);
        if (type === "id") {
            setCopiedId(true);
            setTimeout(() => setCopiedId(false), 2000);
        } else {
            setCopiedSecret(true);
            setTimeout(() => setCopiedSecret(false), 2000);
        }
    };

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-brand-primary" />
                    <h3 className="text-sm font-black text-gray-900">API Access Tokens</h3>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200/60 shadow-inner">
                    <button onClick={() => onToggleEnv("sandbox")} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${creds.environment === "sandbox" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}>Sandbox</button>
                    <button onClick={() => onToggleEnv("production")} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${creds.environment === "production" ? "bg-white text-rose-600 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}>Production</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Client ID Card */}
                <div className="border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col gap-4 bg-gray-50/50">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-black text-gray-900 uppercase tracking-wider">Client ID</label>
                        <p className="text-[11px] text-gray-500">Public identifier for your application.</p>
                    </div>
                    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-1 pl-4">
                        <span className="font-mono text-sm text-gray-900 font-bold truncate">{creds.clientId}</span>
                        <Button variant="ghost" size="sm" className="h-8 text-gray-500 hover:text-gray-900 hover:bg-gray-50" onClick={() => handleCopy(creds.clientId, "id")}>
                            {copiedId ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                    </div>
                </div>

                {/* Client Secret Card */}
                <div className="border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col gap-4 bg-gray-50/50">
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-black text-gray-900 uppercase tracking-wider">Client Secret</label>
                            <p className="text-[11px] text-gray-500">Keep secure. Never expose in frontend code.</p>
                        </div>
                        <Button variant="outline" size="sm" className="h-7 text-[10px] text-rose-600 border-rose-200 bg-rose-50 hover:bg-rose-100 font-bold" onClick={onRegenerate}>
                            <RefreshCw className="w-3 h-3 mr-1" /> Re-roll
                        </Button>
                    </div>
                    <div className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-lg p-1 pl-4">
                        <div className="flex items-center gap-3">
                            <span className="font-mono text-sm text-gray-100 tracking-widest truncate">
                                {isSecretRevealed ? creds.clientSecretMasked : "••••••••••••••••••••••••••••••••"}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon-sm" className="h-8 text-gray-400 hover:text-white" onClick={() => setIsSecretRevealed(!isSecretRevealed)}>
                                {isSecretRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button variant="ghost" size="icon-sm" className="h-8 text-gray-400 hover:text-white" onClick={() => handleCopy(creds.clientSecretMasked, "secret")}>
                                {copiedSecret ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
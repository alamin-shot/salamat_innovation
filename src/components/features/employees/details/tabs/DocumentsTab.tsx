"use client";
import { useState } from "react";
import { EmployeeDetailManagerType } from "@/hooks/employee_hooks/useEmployeeDetailManager";
import { Button } from "@/components/ui/Button";
import { UploadCloud, FileText, Trash2, Eye } from "lucide-react";

export function DocumentsTab({ manager }: { manager: EmployeeDetailManagerType }) {
    const { documents } = manager.employee;
    const [docName, setDocName] = useState("");

    const handleUpload = () => {
        if (!docName.trim()) return;
        manager.uploadDocument(docName, `${docName.toLowerCase().replace(/\s+/g, "_")}.pdf`, "2.1 MB");
        setDocName("");
    };

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="erp-card bg-white p-6 shadow-sm">
                <div className="border-b border-gray-100 pb-4 mb-6">
                    <h2 className="text-lg font-bold text-gray-900">Documents</h2>
                    <p className="text-xs text-gray-500 mt-1">Upload and manage employee documents and attachments</p>
                </div>

                <div className="bg-gray-50/50 border border-gray-100 rounded-lg p-5 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        <div className="flex flex-col gap-3">
                            <label className="erp-label">Document Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                className="erp-input"
                                placeholder="e.g. NID Card, Resume"
                                value={docName}
                                onChange={e => setDocName(e.target.value)}
                            />
                            <div className="mt-2">
                                <Button variant="default" onClick={handleUpload} disabled={!docName.trim()}>
                                    <UploadCloud className="w-4 h-4 mr-2" /> Upload Documents
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5 h-full">
                            <label className="erp-label">Attachments <span className="text-red-500">*</span></label>
                            <div className="flex-1 border-2 border-dashed border-emerald-500/30 bg-emerald-50/20 rounded-lg flex items-center justify-center p-6 text-center cursor-pointer hover:bg-emerald-50 transition-colors h-[104px]">
                                <div className="flex items-center gap-3 text-emerald-700">
                                    <UploadCloud className="w-5 h-5 opacity-70" />
                                    <div className="flex flex-col items-start">
                                        <span className="text-sm font-medium">Drop files here or click to upload</span>
                                        <span className="text-xs text-emerald-600/70 font-bold uppercase tracking-widest mt-0.5">Upload Files</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {documents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 opacity-50">
                        <FileText className="w-12 h-12 text-gray-300 mb-3" />
                        <span className="text-sm text-gray-500">No documents uploaded yet.</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {documents.map(doc => (
                            <div key={doc.id} className="border border-gray-200 rounded-lg p-4 flex flex-col gap-3 group hover:border-brand-primary/40 hover:shadow-sm transition-all bg-white">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded bg-indigo-50 text-indigo-500 flex items-center justify-center">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-900 truncate max-w-[150px]">{doc.documentName}</h3>
                                            <p className="text-[10px] text-gray-500 font-mono mt-0.5">{doc.fileName}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon-sm"><Eye className="w-3.5 h-3.5 text-blue-500" /></Button>
                                        <Button variant="destructive-ghost" size="icon-sm" onClick={() => manager.removeDocument(doc.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest border-t border-gray-100 pt-2 mt-1">
                                    <span>{doc.fileSize}</span>
                                    <span>{doc.uploadedAt}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
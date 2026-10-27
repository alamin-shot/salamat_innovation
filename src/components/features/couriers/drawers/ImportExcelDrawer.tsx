"use client";
import { useState, useRef } from "react";
import { CourierManagerType } from "@/hooks/courier_hooks/useCourierManager";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { UploadCloud, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";

export function ImportExcelDrawer({ manager }: { manager: CourierManagerType }) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleImport = () => {
        if (!selectedFile) {
            toast.error("Please select a file first.");
            return;
        }
        manager.store.importExcel(selectedFile);
        toast.success(`${selectedFile.name} imported successfully.`);
        setSelectedFile(null);
        manager.closeDrawer();
    };

    const handleClose = () => {
        setSelectedFile(null);
        manager.closeDrawer();
    };

    return (
        <Drawer
            title="Import Orders from Excel"
            isOpen={manager.activeDrawer === "import-excel"}
            onClose={handleClose}
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 max-w-lg mx-auto w-full flex flex-col gap-6">
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Steadfast Orders File (.xlsx, .xls, .csv) <span className="text-red-500">*</span></label>

                        {/* Custom File Upload Area */}
                        <div
                            className="border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center gap-3 bg-gray-50 hover:bg-emerald-50 hover:border-emerald-200 transition-colors cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {selectedFile ? (
                                <>
                                    <FileSpreadsheet className="h-10 w-10 text-emerald-500" />
                                    <div className="text-sm font-medium text-emerald-700">{selectedFile.name}</div>
                                    <div className="text-xs text-gray-400">Click to change file</div>
                                </>
                            ) : (
                                <>
                                    <UploadCloud className="h-10 w-10 text-gray-400" />
                                    <div className="text-sm font-medium text-gray-700">Click to browse or drag and drop</div>
                                    <div className="text-xs text-gray-400">XLSX, XLS, or CSV files only</div>
                                </>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                className="hidden"
                            />
                        </div>
                    </div>

                    <p className="text-xs text-gray-500 leading-relaxed bg-gray-50 p-4 rounded-md border border-gray-100">
                        Export your orders from the Steadfast merchant dashboard and upload that file here. Orders already in the list will be updated, not duplicated.
                    </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white mt-auto shrink-0">
                    <Button variant="outline" onClick={handleClose} className="px-6 h-9">
                        Cancel
                    </Button>
                    <Button variant="success" onClick={handleImport} className="px-8 h-9 gap-2" disabled={!selectedFile}>
                        <UploadCloud className="h-4 w-4" />
                        Import
                    </Button>
                </div>
            </div>
        </Drawer>
    );
}
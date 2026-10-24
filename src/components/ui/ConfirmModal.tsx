import { Button } from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl animate-in zoom-in-95">
                <div className="flex items-center gap-4 text-red-600 mb-4">
                    <div className="rounded-full bg-red-100 p-2"><AlertTriangle className="h-6 w-6" /></div>
                    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                </div>
                <p className="mb-6 text-sm text-gray-600">{message}</p>
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={onCancel} className="px-5 text-gray-600">Cancel</Button>
                    <Button variant="destructive" onClick={onConfirm} className="px-5">Delete Permanently</Button>
                </div>
            </div>
        </div>
    );
}
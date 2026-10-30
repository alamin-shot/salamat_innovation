"use client";
import { useProductVerifyManager } from "@/hooks/product_verify_hooks/useProductVerifyManager";
import { ProductVerifyDrawer } from "./ProductVerifyDrawer";
import { Button } from "@/components/ui/Button";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { Trash2, CheckCircle, XCircle, Eye } from "lucide-react";

export function ProductVerifyClient() {
    const manager = useProductVerifyManager();

    const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) manager.setSelectedIds(manager.requests.map(r => r.id));
        else manager.setSelectedIds([]);
    };

    const toggleSelect = (id: string) => {
        manager.setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
        );
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-amber-50 text-amber-600';
            case 'Active':
            case 'Approved': return 'bg-green-50 text-green-600';
            case 'Rejected': return 'bg-red-50 text-red-500';
            default: return 'bg-gray-50 text-gray-600';
        }
    };

    return (
        <div className="flex flex-col w-full h-full gap-6 p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-900">Product Verify List</h1>
            </div>

            <div className="flex-1 erp-card flex flex-col bg-white overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <input type="text" placeholder="Search..." className="erp-input max-w-sm" />
                </div>

                <div className="w-full overflow-x-auto min-h-[350px]">
                    <table className="w-full text-left text-sm text-brand-subtext border-collapse">
                        <thead className="bg-brand-primary/5 text-brand-text border-b border-brand-subtext/20">
                            <tr>
                                <th className="p-4 w-12">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-brand-primary cursor-pointer"
                                        checked={manager.requests.length > 0 && manager.selectedIds.length === manager.requests.length}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th className="p-4 font-semibold w-48">Name & Phone</th>
                                <th className="p-4 font-semibold">Product Name</th>
                                <th className="p-4 font-semibold">Full Address</th>
                                <th className="p-4 font-semibold w-28">Status</th>
                                <th className="p-4 font-semibold text-right w-44">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-subtext/10">
                            {manager.requests.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">No records found.</td>
                                </tr>
                            ) : (
                                manager.requests.map((request) => (
                                    <tr key={request.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="p-4 align-top">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-brand-primary cursor-pointer"
                                                checked={manager.selectedIds.includes(request.id)}
                                                onChange={() => toggleSelect(request.id)}
                                            />
                                        </td>
                                        <td className="p-4 align-top">
                                            <div className="font-medium text-gray-900">{request.userName}</div>
                                            <div className="text-xs text-gray-500 mt-0.5">{request.phone}</div>
                                        </td>
                                        <td className="p-4 align-top font-medium text-gray-800 line-clamp-2">
                                            {request.productName}
                                        </td>
                                        <td className="p-4 align-top text-gray-600">
                                            {request.fullAddress || '-'}
                                        </td>
                                        <td className="p-4 align-top">
                                            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${getStatusStyles(request.status)}`}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className="p-4 align-top text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon-sm" onClick={() => manager.openDrawer(request.id)} title="View Details">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                {request.status !== 'Approved' && request.status !== 'Active' && (
                                                    <Button variant="ghost" size="icon-sm" onClick={() => manager.handleStatusUpdate(request.id, "Approved")} title="Approve" className="text-green-600 hover:bg-green-50">
                                                        <CheckCircle className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                {request.status !== 'Rejected' && (
                                                    <Button variant="ghost" size="icon-sm" onClick={() => manager.handleStatusUpdate(request.id, "Rejected")} title="Reject" className="text-red-500 hover:bg-red-50">
                                                        <XCircle className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <Button variant="destructive-ghost" size="icon-sm" onClick={() => manager.handleDelete(request.id)} title="Delete">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {manager.selectedIds.length > 0 && (
                <BulkActionBar selectedCount={manager.selectedIds.length} onClearSelection={() => manager.setSelectedIds([])}>
                    <Button variant="destructive" size="sm" onClick={manager.handleBulkDelete}>Delete Selected</Button>
                </BulkActionBar>
            )}

            <ProductVerifyDrawer manager={manager} />
        </div>
    );
}
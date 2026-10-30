"use client";
import { useReviewManager } from "@/hooks/review_hooks/useReviewManager";
import { ReviewDrawer } from "./ReviewDrawer";
import { Button } from "@/components/ui/Button";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { Edit, Trash2, CheckCircle, XCircle, Star, MessageSquare } from "lucide-react";

export function ReviewClient() {
    const manager = useReviewManager();

    const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) manager.setSelectedIds(manager.reviews.map(r => r.id));
        else manager.setSelectedIds([]);
    };

    const toggleSelect = (id: string) => {
        manager.setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
        );
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map(star => (
                    <Star
                        key={star}
                        className={`h-3.5 w-3.5 ${star <= rating ? "fill-amber-400 text-amber-400" : "fill-gray-100 text-gray-200"}`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="flex flex-col w-full h-full gap-6 p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-900">Product Reviews</h1>
            </div>

            <div className="flex-1 erp-card flex flex-col bg-white overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <input
                        type="text"
                        placeholder="Search by product or customer..."
                        className="erp-input max-w-xs"
                    />
                </div>

                <div className="w-full overflow-x-auto min-h-[350px]">
                    <table className="w-full text-left text-sm text-brand-subtext border-collapse">
                        <thead className="bg-brand-primary/5 text-brand-text border-b border-brand-subtext/20">
                            <tr>
                                <th className="p-4 w-12">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                                        checked={manager.reviews.length > 0 && manager.selectedIds.length === manager.reviews.length}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th className="p-4 font-semibold w-64">Product</th>
                                <th className="p-4 font-semibold w-40">Customer</th>
                                <th className="p-4 font-semibold w-28">Rating</th>
                                <th className="p-4 font-semibold">Comment</th>
                                <th className="p-4 font-semibold w-28">Status</th>
                                <th className="p-4 font-semibold text-right w-44">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-subtext/10">
                            {manager.reviews.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-500">
                                        No reviews found.
                                    </td>
                                </tr>
                            ) : (
                                manager.reviews.map((review) => (
                                    <tr key={review.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="p-4 align-top">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                                                checked={manager.selectedIds.includes(review.id)}
                                                onChange={() => toggleSelect(review.id)}
                                            />
                                        </td>
                                        <td className="p-4 align-top font-medium text-gray-900 line-clamp-2">{review.productName}</td>
                                        <td className="p-4 align-top text-gray-600">{review.customerName}</td>
                                        <td className="p-4 align-top">{renderStars(review.rating)}</td>
                                        <td className="p-4 align-top">
                                            <p className="text-sm text-gray-700 line-clamp-2">{review.comment}</p>
                                            {review.reply && (
                                                <div className="mt-1 flex items-start gap-1.5 text-xs text-brand-primary bg-brand-primary/5 p-2 rounded">
                                                    <MessageSquare className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                                                    <span className="line-clamp-1">{review.reply}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 align-top">
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${review.status === 'Approved' ? 'bg-green-50 text-green-600' :
                                                review.status === 'Rejected' ? 'bg-red-50 text-red-500' :
                                                    'bg-amber-50 text-amber-600'
                                                }`}>
                                                {review.status}
                                            </span>
                                        </td>
                                        <td className="p-4 align-top text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {review.status === 'Pending' && (
                                                    <>
                                                        <Button variant="ghost" size="icon-sm" onClick={() => manager.handleStatusUpdate(review.id, "Approved")} title="Approve" className="text-green-600 hover:bg-green-50">
                                                            <CheckCircle className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon-sm" onClick={() => manager.handleStatusUpdate(review.id, "Rejected")} title="Reject" className="text-red-500 hover:bg-red-50">
                                                            <XCircle className="h-4 w-4" />
                                                        </Button>
                                                    </>
                                                )}
                                                <Button variant="ghost" size="icon-sm" onClick={() => manager.openEditDrawer(review.id)} title="Reply / Edit">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="destructive-ghost" size="icon-sm" onClick={() => manager.handleDelete(review.id)} title="Delete">
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
                <BulkActionBar
                    selectedCount={manager.selectedIds.length}
                    onClearSelection={() => manager.setSelectedIds([])}
                >
                    <Button variant="destructive" size="sm" onClick={manager.handleBulkDelete}>
                        Delete Selected
                    </Button>
                </BulkActionBar>
            )}

            <ReviewDrawer manager={manager} />
        </div>
    );
}
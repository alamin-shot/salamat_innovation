"use client";
import { useNewsManager } from "@/hooks/news_hooks/useNewsManager";
import { NewsDrawer } from "./NewsDrawer";
import { Button } from "@/components/ui/Button";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { Edit, Trash2, Plus, Link as LinkIcon } from "lucide-react";

export function NewsClient() {
    const manager = useNewsManager();

    const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) manager.setSelectedIds(manager.articles.map(a => a.id));
        else manager.setSelectedIds([]);
    };

    const toggleSelect = (id: string) => {
        manager.setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
        );
    };

    return (
        <div className="flex flex-col w-full h-full gap-6 p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-900">News</h1>
                <Button variant="success" onClick={manager.openAddDrawer} className="h-9 px-4 gap-2">
                    <Plus className="h-4 w-4" /> Add News
                </Button>
            </div>

            <div className="flex-1 erp-card flex flex-col bg-white overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <input
                        type="text"
                        placeholder="Search news..."
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
                                        checked={manager.articles.length > 0 && manager.selectedIds.length === manager.articles.length}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th className="p-4 font-semibold">Name</th>
                                <th className="p-4 font-semibold">Heading</th>
                                <th className="p-4 font-semibold text-center w-32">Attachments</th>
                                <th className="p-4 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-subtext/10">
                            {manager.articles.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        No news articles found. Create one to get started.
                                    </td>
                                </tr>
                            ) : (
                                manager.articles.map((article) => (
                                    <tr key={article.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="p-4">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                                                checked={manager.selectedIds.includes(article.id)}
                                                onChange={() => toggleSelect(article.id)}
                                            />
                                        </td>
                                        <td className="p-4 font-medium text-gray-900">{article.name}</td>
                                        <td className="p-4 text-gray-600">{article.heading}</td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center text-blue-500">
                                                <LinkIcon className="h-4 w-4" />
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon-sm" onClick={() => manager.openEditDrawer(article.id)} title="Edit">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="destructive-ghost" size="icon-sm" onClick={() => manager.handleDelete(article.id)} title="Delete">
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

            <NewsDrawer manager={manager} />
        </div>
    );
}
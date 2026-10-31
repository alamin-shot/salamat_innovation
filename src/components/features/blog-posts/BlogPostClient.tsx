"use client";
import { useBlogPostManager } from "@/hooks/blog_hooks/useBlogPostManager";
import { BlogPostDrawer } from "./BlogPostDrawer";
import { ReorderDrawer } from "./ReorderDrawer";
import { Button } from "@/components/ui/Button";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Edit, Trash2, Eye, Plus, ArrowUpDown } from "lucide-react";

export function BlogPostClient() {
    const manager = useBlogPostManager();

    const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) manager.setSelectedIds(manager.posts.map(p => p.id));
        else manager.setSelectedIds([]);
    };

    const toggleSelect = (id: string) => {
        manager.setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
        );
    };

    const formatDateTime = (isoString: string) => {
        if (!isoString) return "-";
        const date = new Date(isoString);
        return date.toLocaleString('en-GB', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true
        }).replace(/,/g, '');
    };

    const quickActionOptions = [
        "Quick Actions...",
        "Publish",
        "Unpublish",
        "Toggle Featured",
        "Toggle Trending",
        "Toggle Popular"
    ];

    return (
        <div className="flex flex-col w-full h-full gap-6 p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-900">Blog Posts</h1>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={manager.openReorderDrawer} className="flex items-center gap-2">
                        <ArrowUpDown className="h-4 w-4" /> Reorder Pinned Posts
                    </Button>
                    <Button variant="default" onClick={manager.openAddDrawer} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" /> Add Blog Post
                    </Button>
                </div>
            </div>

            {/* Added min-h and pb-32 to prevent CustomSelect dropdown clipping */}
            <div className="flex-1 erp-card flex flex-col bg-white overflow-hidden min-h-[450px] pb-32">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <input type="text" placeholder="Search blog posts..." className="erp-input max-w-sm" />
                </div>

                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left text-sm text-brand-subtext border-collapse">
                        <thead className="bg-brand-primary/5 text-brand-text border-b border-brand-subtext/20">
                            <tr>
                                <th className="p-4 w-12">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-brand-primary cursor-pointer"
                                        checked={manager.posts.length > 0 && manager.selectedIds.length === manager.posts.length}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th className="p-4 font-semibold w-64">Title</th>
                                <th className="p-4 font-semibold w-32">Category</th>
                                <th className="p-4 font-semibold w-24">Status</th>
                                <th className="p-4 font-semibold w-40">Flags</th>
                                <th className="p-4 font-semibold text-right w-64">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-subtext/10">
                            {manager.posts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">No blog posts found.</td>
                                </tr>
                            ) : (
                                manager.posts.map((post) => (
                                    <tr key={post.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="p-4 align-middle">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-brand-primary cursor-pointer"
                                                checked={manager.selectedIds.includes(post.id)}
                                                onChange={() => toggleSelect(post.id)}
                                            />
                                        </td>
                                        <td className="p-4 align-middle font-medium text-gray-900 line-clamp-2">{post.title}</td>
                                        <td className="p-4 align-middle text-gray-700">{post.category}</td>
                                        <td className="p-4 align-middle">
                                            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${post.isPublished ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                {post.isPublished ? "Published" : "Draft"}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="flex flex-wrap gap-1">
                                                {post.isFeatured && <span className="text-[10px] font-bold bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded">Featured</span>}
                                                {post.isTrending && <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">Trending</span>}
                                                {post.isPopular && <span className="text-[10px] font-bold bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded">Popular</span>}
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                {/* Inline Table Actions via CustomSelect */}
                                                <div className="w-40 text-left">
                                                    <CustomSelect
                                                        value="Quick Actions..."
                                                        options={quickActionOptions}
                                                        onChange={(val) => {
                                                            if (val !== "Quick Actions...") {
                                                                manager.handleQuickAction(post.id, val);
                                                            }
                                                        }}
                                                    />
                                                </div>

                                                {/* Strict Ghost Action Buttons */}
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon-sm" title="View">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon-sm" onClick={() => manager.openEditDrawer(post.id)} title="Edit">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="destructive-ghost" size="icon-sm" onClick={() => manager.handleDelete(post.id)} title="Delete">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
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

            <BlogPostDrawer manager={manager} />
            <ReorderDrawer manager={manager} />
        </div>
    );
}
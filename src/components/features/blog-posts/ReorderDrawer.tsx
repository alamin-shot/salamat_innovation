"use client";
import { BlogPostManagerType } from "@/hooks/blog_hooks/useBlogPostManager";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { GripVertical } from "lucide-react";

export function ReorderDrawer({ manager }: { manager: BlogPostManagerType }) {
    // For visual demonstration of the reorder list (in production this would use dnd-kit or react-beautiful-dnd)
    const pinnedPosts = manager.posts.filter(p => p.isFeatured || p.isTrending || p.isPopular);

    return (
        <Drawer
            title="Reorder Pinned Posts"
            isOpen={manager.activeDrawer === "reorder"}
            onClose={manager.closeDrawer}
            width="w-full sm:w-[600px]"
        >
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 w-full px-6 overflow-y-auto custom-scrollbar pb-12">
                    <p className="text-sm text-gray-500 mb-6">
                        These lead Recent Posts and the first page of All Posts. Drag to reorder, then save.
                    </p>

                    <div className="flex flex-col gap-3">
                        {pinnedPosts.length === 0 ? (
                            <div className="text-center text-gray-500 py-8 text-sm">No pinned posts available to reorder.</div>
                        ) : (
                            pinnedPosts.map((post, index) => (
                                <div key={post.id} className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-brand-primary cursor-move">
                                    <GripVertical className="text-gray-400 w-5 h-5 shrink-0" />
                                    <div className="w-6 h-6 shrink-0 bg-gray-100 rounded text-xs font-bold flex items-center justify-center text-gray-600">
                                        {index + 1}
                                    </div>
                                    <div className="w-10 h-10 bg-gray-200 rounded shrink-0"></div>
                                    <div className="font-medium text-sm text-gray-900 line-clamp-1">{post.title}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white mt-auto shrink-0 px-6 pb-4">
                    <Button variant="outline" onClick={manager.closeDrawer} className="px-6 h-9">Cancel</Button>
                    <Button variant="default" onClick={() => manager.closeDrawer()} className="px-8 h-9">
                        Save Order
                    </Button>
                </div>
            </div>
        </Drawer>
    );
}
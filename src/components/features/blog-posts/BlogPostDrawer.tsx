"use client";
import { useState, useEffect } from "react";
import { BlogPostManagerType } from "@/hooks/blog_hooks/useBlogPostManager";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { MultiSelect } from "@/components/shared/MultiSelect";
import { RichTextEditor } from "@/components/shared/RichTextEditor";
import { ImagePlus } from "lucide-react";

// Mock Data for Selectors
const CATEGORIES = ["Brand Spotlight", "Top Picks", "Price Guides", "Buying Guides"];
const TAGS = ["Android", "iOS", "Battery", "Charger", "Guide", "Review", "Gadget"];

export function BlogPostDrawer({ manager }: { manager: BlogPostManagerType }) {
    const isEdit = manager.activeDrawer === "edit";
    const activePost = manager.getActivePost();

    // Core Form State
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [readingTime, setReadingTime] = useState<number>(0);
    const [publishedAt, setPublishedAt] = useState("");

    // Flags
    const [isPublished, setIsPublished] = useState(false);
    const [isFeatured, setIsFeatured] = useState(false);
    const [isTrending, setIsTrending] = useState(false);
    const [isPopular, setIsPopular] = useState(false);

    // SEO State
    const [metaTitle, setMetaTitle] = useState("");
    const [metaDescription, setMetaDescription] = useState("");
    const [metaTags, setMetaTags] = useState("");

    useEffect(() => {
        if (isEdit && activePost) {
            setTitle(activePost.title);
            setCategory(activePost.category);
            setTags(activePost.tags);
            setExcerpt(activePost.excerpt);
            setContent(activePost.content);
            setReadingTime(activePost.readingTime);
            setPublishedAt(activePost.publishedAt);
            setIsPublished(activePost.isPublished);
            setIsFeatured(activePost.isFeatured);
            setIsTrending(activePost.isTrending);
            setIsPopular(activePost.isPopular);
            setMetaTitle(activePost.metaTitle);
            setMetaDescription(activePost.metaDescription);
            setMetaTags(activePost.metaTags);
        } else if (manager.activeDrawer === "add") {
            setTitle("");
            setCategory("");
            setTags([]);
            setExcerpt("");
            setContent("");
            setReadingTime(1);
            setPublishedAt(new Date().toISOString());
            setIsPublished(false);
            setIsFeatured(false);
            setIsTrending(false);
            setIsPopular(false);
            setMetaTitle("");
            setMetaDescription("");
            setMetaTags("");
        }
    }, [isEdit, activePost, manager.activeDrawer]);

    const onSubmit = () => {
        manager.handleSubmit({
            title, category, tags, excerpt, content,
            thumbnailUrl: null, bannerUrl: null,
            readingTime, publishedAt,
            isPublished, isFeatured, isTrending, isPopular,
            metaTitle, metaDescription, metaTags
        });
    };

    return (
        <Drawer
            title={isEdit ? "Update Blog Post" : "Add Blog Post"}
            isOpen={manager.activeDrawer === "add" || manager.activeDrawer === "edit"}
            onClose={manager.closeDrawer}
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 w-full flex flex-col gap-8 px-6 overflow-y-auto custom-scrollbar pb-12">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Category <span className="text-red-500">*</span></label>
                            <CustomSelect
                                value={category}
                                options={CATEGORIES}
                                onChange={setCategory}
                                placeholder="Choose a category"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Tags</label>
                            <MultiSelect
                                value={tags}
                                options={TAGS}
                                onChange={setTags}
                                placeholder="Choose tags"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Title <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            className="erp-input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Excerpt</label>
                        <textarea
                            className="erp-input h-20 resize-none"
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                        />
                    </div>

                    <RichTextEditor label="Content" value={content} onChange={setContent} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Thumbnail <span className="text-red-500">*</span></label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer">
                                <ImagePlus className="w-6 h-6 mb-2" />
                                <span className="text-xs">Recommended size: 800x600</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Banner</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer">
                                <ImagePlus className="w-6 h-6 mb-2" />
                                <span className="text-xs">Recommended size: 1200x600</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Reading Time (minutes)</label>
                            <input
                                type="number"
                                className="erp-input"
                                value={readingTime}
                                onChange={(e) => setReadingTime(Number(e.target.value))}
                                min={1}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Published At</label>
                            <input
                                type="datetime-local"
                                className="erp-input text-gray-700"
                                value={publishedAt ? publishedAt.slice(0, 16) : ""}
                                onChange={(e) => setPublishedAt(e.target.value ? new Date(e.target.value).toISOString() : "")}
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-6 items-center pt-2">
                        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                            <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="rounded border-gray-300 text-brand-primary" />
                            Published
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="rounded border-gray-300 text-brand-primary" />
                            Featured
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                            <input type="checkbox" checked={isTrending} onChange={(e) => setIsTrending(e.target.checked)} className="rounded border-gray-300 text-brand-primary" />
                            Trending
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                            <input type="checkbox" checked={isPopular} onChange={(e) => setIsPopular(e.target.checked)} className="rounded border-gray-300 text-brand-primary" />
                            Popular
                        </label>
                    </div>

                    <hr className="border-gray-100" />
                    <h3 className="font-bold text-gray-800">SEO Configuration</h3>

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Meta Title</label>
                            <input type="text" className="erp-input" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Meta Description</label>
                            <textarea className="erp-input h-20 resize-none" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Meta Tags (separate with comma)</label>
                            <input type="text" className="erp-input" value={metaTags} onChange={(e) => setMetaTags(e.target.value)} />
                        </div>
                    </div>

                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white mt-auto shrink-0 px-6 pb-4">
                    <Button variant="outline" onClick={manager.closeDrawer} className="px-6 h-9">Cancel</Button>
                    <Button variant="default" onClick={onSubmit} className="px-8 h-9">
                        {isEdit ? "Update Post" : "Submit"}
                    </Button>
                </div>
            </div>
        </Drawer>
    );
}
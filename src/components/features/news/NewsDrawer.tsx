"use client";
import { useState, useEffect } from "react";
import { NewsManagerType } from "@/hooks/news_hooks/useNewsManager";
import { NewsArticle } from "@/store/useNewsStore";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Image as ImageIcon, Bold, Italic, Underline, Link, List, AlignLeft } from "lucide-react";

export function NewsDrawer({ manager }: { manager: NewsManagerType }) {
    const isEditing = manager.activeDrawer === "edit";
    const activeArticle = manager.getActiveArticle();

    const [formData, setFormData] = useState<Omit<NewsArticle, "id">>({
        name: "",
        heading: "",
        slug: "",
        description: "",
        image: null,
        seo: null
    });

    const [showSeo, setShowSeo] = useState(false);

    useEffect(() => {
        if (isEditing && activeArticle) {
            setFormData(JSON.parse(JSON.stringify(activeArticle)));
            setShowSeo(!!activeArticle.seo);
        } else if (manager.activeDrawer === "add") {
            setFormData({
                name: "",
                heading: "",
                slug: "",
                description: "",
                image: null,
                seo: null
            });
            setShowSeo(false);
        }
    }, [isEditing, activeArticle, manager.activeDrawer]);

    const handleSubmit = () => {
        if (!formData.name.trim()) return alert("Name is required");
        if (!formData.heading.trim()) return alert("Heading is required");

        // Clean up SEO block if toggled off before saving
        const payload = { ...formData };
        if (!showSeo) {
            payload.seo = null;
        }

        manager.handleSubmit(payload);
    };

    const toggleSeoBlock = () => {
        if (!showSeo) {
            setFormData(prev => ({
                ...prev,
                seo: prev.seo || { metaTitle: "", metaDescription: "", metaKeywords: "" }
            }));
        }
        setShowSeo(!showSeo);
    };

    const updateSeo = (field: keyof NonNullable<NewsArticle['seo']>, value: string) => {
        setFormData(prev => ({
            ...prev,
            seo: {
                ...(prev.seo || { metaTitle: "", metaDescription: "", metaKeywords: "" }),
                [field]: value
            }
        }));
    };

    return (
        <Drawer
            title={isEditing ? "Update News" : "Add News"}
            isOpen={manager.activeDrawer !== "none"}
            onClose={manager.closeDrawer}
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col gap-6 px-4 overflow-y-auto custom-scrollbar pb-10">

                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            className="erp-input"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Heading <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            className="erp-input"
                            value={formData.heading}
                            onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Slug</label>
                        <input
                            type="text"
                            className="erp-input bg-gray-50"
                            placeholder="Auto-generated if left blank"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        />
                    </div>

                    {/* Rich Text Editor UI */}
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Description</label>
                        <div className="border border-gray-300 rounded-md overflow-hidden flex flex-col focus-within:ring-1 focus-within:ring-brand-primary focus-within:border-brand-primary transition-all">
                            <div className="bg-gray-50 border-b border-gray-200 p-2 flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-medium px-2 py-1 bg-white border border-gray-200 rounded shadow-sm">Normal</span>
                                <div className="h-4 w-px bg-gray-300 mx-1" />
                                <Button variant="ghost" size="icon-sm" className="h-7 w-7 text-gray-600"><AlignLeft className="h-3.5 w-3.5" /></Button>
                                <Button variant="ghost" size="icon-sm" className="h-7 w-7 text-gray-600"><Bold className="h-3.5 w-3.5" /></Button>
                                <Button variant="ghost" size="icon-sm" className="h-7 w-7 text-gray-600"><Italic className="h-3.5 w-3.5" /></Button>
                                <Button variant="ghost" size="icon-sm" className="h-7 w-7 text-gray-600"><Underline className="h-3.5 w-3.5" /></Button>
                                <Button variant="ghost" size="icon-sm" className="h-7 w-7 text-gray-600"><Link className="h-3.5 w-3.5" /></Button>
                                <Button variant="ghost" size="icon-sm" className="h-7 w-7 text-gray-600"><List className="h-3.5 w-3.5" /></Button>
                            </div>
                            <textarea
                                className="w-full p-4 h-48 resize-none focus:outline-none text-sm text-gray-700 leading-relaxed"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Image</label>
                        <div className="border-2 border-dashed border-gray-200 rounded-lg h-32 flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-brand-primary/5 cursor-pointer transition-colors w-1/2">
                            <ImageIcon className="h-8 w-8 text-gray-400" />
                            <div className="text-center">
                                <p className="text-xs font-medium text-gray-600">Recommended size: 100 x 100 PX</p>
                                <p className="text-[10px] text-gray-400">Max file size: 2MB</p>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100 my-2" />

                    <div>
                        <Button
                            variant={showSeo ? "destructive-ghost" : "success"}
                            className={showSeo ? "h-8 px-4" : "h-8 px-4"}
                            onClick={toggleSeoBlock}
                        >
                            {showSeo ? "Remove SEO Block" : "Add SEO Block"}
                        </Button>
                    </div>

                    {showSeo && (
                        <div className="flex flex-col gap-4 p-5 bg-gray-50 border border-gray-200 rounded-lg animate-in fade-in slide-in-from-top-2 duration-200">
                            <h3 className="font-semibold text-gray-800 text-sm">SEO Meta Configuration</h3>
                            <div className="flex flex-col gap-1.5">
                                <label className="erp-label">Meta Title</label>
                                <input
                                    type="text"
                                    className="erp-input bg-white"
                                    value={formData.seo?.metaTitle || ""}
                                    onChange={(e) => updateSeo("metaTitle", e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="erp-label">Meta Description</label>
                                <textarea
                                    className="erp-input bg-white h-20 resize-none"
                                    value={formData.seo?.metaDescription || ""}
                                    onChange={(e) => updateSeo("metaDescription", e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="erp-label">Meta Keywords</label>
                                <input
                                    type="text"
                                    className="erp-input bg-white"
                                    placeholder="keyword1, keyword2, keyword3"
                                    value={formData.seo?.metaKeywords || ""}
                                    onChange={(e) => updateSeo("metaKeywords", e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white mt-auto shrink-0 px-4">
                    <Button variant="outline" onClick={manager.closeDrawer} className="px-6 h-9">Cancel</Button>
                    <Button variant="success" onClick={handleSubmit} className="px-8 h-9">Save</Button>
                </div>
            </div>
        </Drawer>
    );
}
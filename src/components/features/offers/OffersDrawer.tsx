"use client";
import { useState, useEffect } from "react";
import { OffersManagerType } from "@/hooks/offers_hooks/useOffersManager";
import { Offer, OfferProduct } from "@/store/useOffersStore";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { DatePicker } from "@/components/ui/DatePicker"; // Assuming standard internal component
import { Image as ImageIcon, Trash2, Bold, Italic, Underline, Link } from "lucide-react";

export function OffersDrawer({ manager }: { manager: OffersManagerType }) {
    const isEditing = manager.activeDrawer === "edit";
    const activeOffer = manager.getActiveOffer();

    const [formData, setFormData] = useState<Omit<Offer, "id">>({
        title: "",
        description: "",
        banner: null,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        type: "Flash Sale",
        status: "Active",
        products: []
    });

    useEffect(() => {
        if (isEditing && activeOffer) {
            // Deep copy to avoid mutating store accidentally
            setFormData(JSON.parse(JSON.stringify(activeOffer)));
        } else if (manager.activeDrawer === "add") {
            setFormData({
                title: "",
                description: "",
                banner: null,
                startDate: new Date().toISOString(),
                endDate: new Date().toISOString(),
                type: "Flash Sale",
                status: "Active",
                products: []
            });
        }
    }, [isEditing, activeOffer, manager.activeDrawer]);

    const handleSubmit = () => {
        if (!formData.title) return alert("Title is required");
        manager.handleSubmit(formData);
    };

    // Sub-table State Modifiers
    const updateProductDiscount = (productId: string, field: keyof OfferProduct, value: any) => {
        setFormData(prev => ({
            ...prev,
            products: prev.products.map(p => p.id === productId ? { ...p, [field]: value } : p)
        }));
    };

    const removeProduct = (productId: string) => {
        setFormData(prev => ({
            ...prev,
            products: prev.products.filter(p => p.id !== productId)
        }));
    };

    // Dummy adder for the mockup to represent selecting a product from a dropdown
    const handleAddMockProduct = () => {
        const newProd: OfferProduct = {
            id: Date.now().toString(),
            productId: "prod_new",
            productName: "Oraimo OTR 210 Smart Trimmer",
            variantId: "var_new",
            variantName: "Black",
            sku: `SI-${Math.floor(Math.random() * 1000000)}`,
            basePrice: 1535,
            discountType: "Fixed",
            discountAmount: 250
        };
        setFormData(prev => ({ ...prev, products: [...prev.products, newProd] }));
    };

    return (
        <Drawer
            title={isEditing ? "Update Offer" : "Add Offer"}
            isOpen={manager.activeDrawer !== "none"}
            onClose={manager.closeDrawer}
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 max-w-5xl mx-auto w-full flex flex-col gap-6 px-4 overflow-y-auto custom-scrollbar pb-10">

                    {/* Header Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <div className="flex flex-col gap-1.5 lg:col-span-3">
                            <label className="erp-label">Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                className="erp-input"
                                placeholder="Enter offer title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Banner</label>
                            <div className="border-2 border-dashed border-gray-200 rounded-lg h-[42px] flex items-center justify-center bg-gray-50 hover:bg-brand-primary/5 cursor-pointer">
                                <ImageIcon className="h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    {/* Rich Text Editor Mockup */}
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Description</label>
                        <div className="border border-gray-300 rounded-md overflow-hidden flex flex-col focus-within:ring-1 focus-within:ring-brand-primary focus-within:border-brand-primary transition-all">
                            <div className="bg-gray-50 border-b border-gray-200 p-2 flex items-center gap-2">
                                <span className="text-xs font-medium px-2 py-1 bg-white border border-gray-200 rounded shadow-sm">Normal</span>
                                <div className="h-4 w-px bg-gray-300 mx-1" />
                                <Button variant="ghost" size="icon-sm" className="h-7 w-7"><Bold className="h-3.5 w-3.5" /></Button>
                                <Button variant="ghost" size="icon-sm" className="h-7 w-7"><Italic className="h-3.5 w-3.5" /></Button>
                                <Button variant="ghost" size="icon-sm" className="h-7 w-7"><Underline className="h-3.5 w-3.5" /></Button>
                                <Button variant="ghost" size="icon-sm" className="h-7 w-7"><Link className="h-3.5 w-3.5" /></Button>
                            </div>
                            <textarea
                                className="w-full p-3 h-32 resize-none focus:outline-none text-sm text-gray-700"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Settings Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Start At <span className="text-red-500">*</span></label>
                            <DatePicker
                                value={formData.startDate}
                                onChange={(date) => setFormData({ ...formData, startDate: date })}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">End At <span className="text-red-500">*</span></label>
                            <DatePicker
                                value={formData.endDate}
                                onChange={(date) => setFormData({ ...formData, endDate: date })}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Type <span className="text-red-500">*</span></label>
                            <CustomSelect
                                value={formData.type}
                                options={["Flash Sale", "Campaign", "Regular"]}
                                onChange={(val) => setFormData({ ...formData, type: val as any })}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Status <span className="text-red-500">*</span></label>
                            <CustomSelect
                                value={formData.status}
                                options={["Active", "Inactive"]}
                                onChange={(val) => setFormData({ ...formData, status: val as any })}
                            />
                        </div>
                    </div>

                    <hr className="border-gray-100 my-4" />

                    {/* Dynamic Products Section */}
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row gap-4 items-end">
                            <div className="flex flex-col gap-1.5 flex-1">
                                <label className="erp-label">Products</label>
                                <CustomSelect value="" options={["Select Products"]} onChange={() => { }} />
                            </div>
                            <div className="flex flex-col gap-1.5 flex-1">
                                <label className="erp-label">Variant</label>
                                <CustomSelect value="" options={["Choose a Variant"]} onChange={() => { }} />
                            </div>
                            <Button variant="success" onClick={handleAddMockProduct} className="h-9 px-8 shrink-0">
                                Add
                            </Button>
                        </div>

                        {formData.products.length > 0 && (
                            <div className="border border-gray-200 rounded-lg overflow-hidden mt-2">
                                <table className="w-full text-left text-sm text-gray-700">
                                    <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-3">Product Name</th>
                                            <th className="px-4 py-3">SKU</th>
                                            <th className="px-4 py-3 text-right">Base Price</th>
                                            <th className="px-4 py-3 w-40">Discount Type</th>
                                            <th className="px-4 py-3 w-48">Discount Amount</th>
                                            <th className="px-4 py-3 text-center w-16">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {formData.products.map(product => (
                                            <tr key={product.id} className="bg-white">
                                                <td className="px-4 py-3">
                                                    <div className="font-semibold text-gray-900">{product.productName}</div>
                                                    <div className="text-xs text-gray-500">{product.variantName}</div>
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">{product.sku}</td>
                                                <td className="px-4 py-3 text-right font-medium">৳{product.basePrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                                <td className="px-4 py-2">
                                                    <CustomSelect
                                                        size="sm"
                                                        value={product.discountType}
                                                        options={["Fixed", "Percent"]}
                                                        onChange={(val) => updateProductDiscount(product.id, "discountType", val)}
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="number"
                                                        className="erp-input h-8"
                                                        value={product.discountAmount}
                                                        onChange={(e) => updateProductDiscount(product.id, "discountAmount", parseFloat(e.target.value) || 0)}
                                                    />
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <Button
                                                        variant="destructive-ghost"
                                                        size="icon-sm"
                                                        onClick={() => removeProduct(product.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white mt-auto shrink-0 px-4">
                    <Button variant="outline" onClick={manager.closeDrawer} className="px-6 h-9">Cancel</Button>
                    <Button variant="success" onClick={handleSubmit} className="px-8 h-9">Save</Button>
                </div>
            </div>
        </Drawer>
    );
}
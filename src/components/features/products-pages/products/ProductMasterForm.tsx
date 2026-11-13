"use client";
import * as React from "react";
import Image from "next/image";
import { UploadCloud, ChevronDown, Check, Save, X } from "lucide-react";
import { toast } from "sonner";
import { RichTextEditor } from "@/components/ui/forms/RichTextEditor";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Product, ProductInput, ProductVariant, ProductVariantOption, ProductVideo } from "@/types/products";
import { useCatalogNames, useWarrantyCareTextOptions } from "@/hooks/products_hooks/useProductCatalogOptions";
import { hasVariantPriceAboveMrp, mergeVariantDrafts, parsePriceInput, toPriceInput } from "@/utils/productRules";
import { useVariantDrafts } from "@/hooks/products_hooks/useVariantDrafts";
import { VariantsManager } from "./VariantsManager";
import { ProductVideoUploader } from "./ProductVideoUploader";
import { AuditFooter } from "../shared/AuditCells";

interface ProductMasterFormProps {
    product: Product | null;
    onCancel: () => void;
    onSubmit: (input: ProductInput) => void;
}

const INPUT_CLASS = "w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500";
const LABEL_CLASS = "text-xs font-bold text-brand-subtext uppercase tracking-wider";
const SWITCH_TRACK = "h-5 w-9 rounded-full bg-brand-subtext/30 peer-checked:bg-emerald-500 transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full relative shadow-sm";

// Starting rows for a new product, the same the Variants builder showed before.
const NEW_PRODUCT_OPTIONS: ProductVariantOption[] = [{ id: "opt-1", name: "Storage", values: ["128GB"], valueImages: {} }];
const NEW_PRODUCT_VARIANTS: ProductVariant[] = [{ id: "var-1", title: "128GB", sku: "", maxRetailPrice: null, sellingPrice: null, inStock: false, isPrebook: false }];

/** Adds the current value to a dropdown list when it is not one of the managed options. */
const withCurrent = (names: string[], current: string) => (current && !names.includes(current) ? [current, ...names] : names);

export function ProductMasterForm({ product, onCancel, onSubmit }: ProductMasterFormProps) {
    const isEditMode = !!product;
    const { brandNames, categoryNames } = useCatalogNames();
    const { activeTexts, findText } = useWarrantyCareTextOptions();

    // Product information
    const [name, setName] = React.useState(product?.name ?? "");
    const [headline, setHeadline] = React.useState(product?.headline ?? "");
    const [keyFeatures, setKeyFeatures] = React.useState(product?.keyFeatures ?? "");
    const [image, setImage] = React.useState<string | null>(product?.image ?? null);
    const [videos, setVideos] = React.useState<ProductVideo[]>(product?.videos ?? []);

    // Dropdown States
    const [activeDropdown, setActiveDropdown] = React.useState<"brand" | "category" | null>(null);
    const [selectedBrand, setSelectedBrand] = React.useState(product?.brand ?? "");
    const [selectedCategory, setSelectedCategory] = React.useState(product?.category ?? "");

    // Logistics & warranty
    const [bookingMoneyEnabled, setBookingMoneyEnabled] = React.useState(product?.bookingMoneyEnabled ?? true);
    const [bookingMoney, setBookingMoney] = React.useState(toPriceInput(product?.bookingMoney ?? null));
    const [purchasePoint, setPurchasePoint] = React.useState(product?.warranty.purchasePoint ?? "");
    const [warrantyDays, setWarrantyDays] = React.useState(toPriceInput(product?.warranty.warrantyDays ?? null));
    const [warrantyActive, setWarrantyActive] = React.useState(product?.warrantyActive ?? true);

    // Warranty Toggles
    const [hasWarrantyText, setHasWarrantyText] = React.useState(!!product?.warranty.warrantyCareTextId);
    const [warrantyCareTextId, setWarrantyCareTextId] = React.useState(product?.warranty.warrantyCareTextId ?? "");
    const [hasServiceWarranty, setHasServiceWarranty] = React.useState(!!product?.warranty.serviceWarranty);
    const [serviceWarranty, setServiceWarranty] = React.useState(product?.warranty.serviceWarranty ?? "");

    // Variants
    const [variantOptions, setVariantOptions] = React.useState<ProductVariantOption[]>(product?.variantOptions ?? NEW_PRODUCT_OPTIONS);
    const [variants, setVariants] = React.useState<ProductVariant[]>(product?.variants ?? NEW_PRODUCT_VARIANTS);
    // Inline row edits; this form saves them with everything else on submit.
    const variantDrafts = useVariantDrafts();

    // The selected text stays listed even if it has since been deactivated.
    const selectedText = findText(warrantyCareTextId || null);
    const textOptions = [
        ...activeTexts.map((item) => ({ value: item.id, label: item.text })),
        ...(selectedText && selectedText.status !== "Active" ? [{ value: selectedText.id, label: `${selectedText.text} (Inactive)` }] : []),
    ];

    // Click outside handler for dropdowns
    const formRef = React.useRef<HTMLFormElement>(null);
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (formRef.current && !formRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBrand) {
            toast.error("Please choose a brand.");
            return;
        }
        if (!selectedCategory) {
            toast.error("Please choose a category.");
            return;
        }
        if (hasWarrantyText && !warrantyCareTextId) {
            toast.error("Please choose a warranty care text or switch it off.");
            return;
        }
        const finalVariants = mergeVariantDrafts(variants, variantDrafts.getState().drafts);
        if (hasVariantPriceAboveMrp(finalVariants)) {
            toast.error("A variant's Selling Price is higher than its MRP.");
            return;
        }

        onSubmit({
            name: name.trim(),
            headline: headline.trim(),
            keyFeatures,
            image,
            brand: selectedBrand,
            category: selectedCategory,
            videos,
            bookingMoneyEnabled,
            bookingMoney: bookingMoneyEnabled ? parsePriceInput(bookingMoney) : product?.bookingMoney ?? null,
            warrantyActive,
            warranty: {
                purchasePoint: purchasePoint.trim(),
                warrantyDays: parsePriceInput(warrantyDays),
                warrantyCareTextId: hasWarrantyText ? warrantyCareTextId || null : null,
                serviceWarranty: hasServiceWarranty ? serviceWarranty.trim() : "",
            },
            variantOptions,
            variants: finalVariants,
            variantsCount: finalVariants.length,
            // Fields managed from the table and quick views keep their saved values.
            status: product?.status ?? "Active",
            ecommerce: product?.ecommerce ?? false,
            tags: product?.tags ?? [],
            specsCount: product?.specsCount ?? 0,
            hasCare: product?.hasCare ?? false,
            carePlanId: product?.carePlanId ?? null,
        });
    };

    const brandOptions = withCurrent(brandNames, selectedBrand);
    const categoryOptions = withCurrent(categoryNames, selectedCategory);

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="flex h-full flex-col bg-brand-bg/30">
            <div className="flex-1 overflow-y-auto p-6 pb-32 custom-scrollbar">
                <div className="mx-auto max-w-5xl flex flex-col gap-2">

                    {/* CARD 1: PRODUCT INFORMATION */}
                    <div className="rounded-xl border border-brand-subtext/20 bg-white p-6 shadow-sm flex flex-col gap-2">
                        <h3 className="text-sm font-bold text-brand-text uppercase tracking-wider border-b border-brand-subtext/10 pb-3">Product Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div className="flex flex-col gap-1.5">
                                <label className={LABEL_CLASS}>Name <span className="text-red-500">*</span></label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className={INPUT_CLASS} required />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className={LABEL_CLASS}>Headline</label>
                                <input type="text" value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="Headline" className={INPUT_CLASS} />
                            </div>

                            {/* CUSTOM BRAND DROPDOWN */}
                            <div className="flex flex-col gap-1.5 relative">
                                <label className={LABEL_CLASS}>Brand <span className="text-red-500">*</span></label>
                                <div
                                    onClick={() => setActiveDropdown(activeDropdown === "brand" ? null : "brand")}
                                    className={`flex w-full cursor-pointer items-center justify-between rounded-md border bg-white px-3 py-2 text-sm transition-colors ${activeDropdown === "brand" ? "border-emerald-500 ring-1 ring-emerald-500" : "border-brand-subtext/30 hover:border-emerald-400"}`}
                                >
                                    <span className={selectedBrand ? "text-brand-text font-medium" : "text-brand-subtext"}>
                                        {selectedBrand || "Choose a Brand"}
                                    </span>
                                    <ChevronDown className={`h-4 w-4 text-brand-subtext transition-transform duration-200 ${activeDropdown === "brand" ? "rotate-180 text-emerald-600" : ""}`} />
                                </div>

                                {activeDropdown === "brand" && (
                                    <div className="absolute left-0 top-[calc(100%+4px)] z-50 w-full rounded-lg border border-brand-subtext/20 bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
                                        <div className="p-1 max-h-48 overflow-y-auto custom-scrollbar">
                                            {brandOptions.map(brand => (
                                                <div
                                                    key={brand}
                                                    onClick={() => { setSelectedBrand(brand); setActiveDropdown(null); }}
                                                    className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-sm text-brand-text hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                                                >
                                                    <span>{brand}</span>
                                                    {selectedBrand === brand && <Check className="h-4 w-4 text-emerald-600" />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* CUSTOM CATEGORY DROPDOWN */}
                            <div className="flex flex-col gap-1.5 relative">
                                <label className={LABEL_CLASS}>Category <span className="text-red-500">*</span></label>
                                <div
                                    onClick={() => setActiveDropdown(activeDropdown === "category" ? null : "category")}
                                    className={`flex w-full cursor-pointer items-center justify-between rounded-md border bg-white px-3 py-2 text-sm transition-colors ${activeDropdown === "category" ? "border-emerald-500 ring-1 ring-emerald-500" : "border-brand-subtext/30 hover:border-emerald-400"}`}
                                >
                                    <span className={selectedCategory ? "text-brand-text font-medium" : "text-brand-subtext"}>
                                        {selectedCategory || "Choose a category"}
                                    </span>
                                    <ChevronDown className={`h-4 w-4 text-brand-subtext transition-transform duration-200 ${activeDropdown === "category" ? "rotate-180 text-emerald-600" : ""}`} />
                                </div>

                                {activeDropdown === "category" && (
                                    <div className="absolute left-0 top-[calc(100%+4px)] z-50 w-full rounded-lg border border-brand-subtext/20 bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
                                        <div className="p-1 max-h-48 overflow-y-auto custom-scrollbar">
                                            {categoryOptions.map(cat => (
                                                <div
                                                    key={cat}
                                                    onClick={() => { setSelectedCategory(cat); setActiveDropdown(null); }}
                                                    className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-sm text-brand-text hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                                                >
                                                    <span>{cat}</span>
                                                    {selectedCategory === cat && <Check className="h-4 w-4 text-emerald-600" />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className={LABEL_CLASS}>Key Features</label>
                            <RichTextEditor value={keyFeatures} onChange={setKeyFeatures} placeholder="Enter key features..." />
                        </div>
                    </div>

                    {/* CARD 2: PRODUCT IMAGE & VIDEO */}
                    <div className="rounded-xl border border-brand-subtext/20 bg-white p-6 shadow-sm flex flex-col gap-2">
                        <h3 className="text-sm font-bold text-brand-text uppercase tracking-wider border-b border-brand-subtext/10 pb-3">Product Image & Video</h3>

                        <div className="flex flex-col gap-2">
                            <label className={LABEL_CLASS}>Thumbnail Image</label>
                            <div className="flex items-center gap-4">
                                {image ? (
                                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-brand-subtext/20 bg-brand-bg">
                                        <Image src={image} alt={name || "Thumbnail"} fill sizes="96px" className="object-contain p-1" />
                                        <button
                                            type="button"
                                            onClick={() => setImage(null)}
                                            className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600 transition-colors"
                                            title="Remove image"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => { setImage("/phone.png"); toast.success("Image uploaded successfully."); }}
                                        className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-lg border-2 border-dashed border-brand-subtext/30 bg-brand-bg/50 transition-colors hover:border-emerald-500/50 hover:bg-emerald-50/50 cursor-pointer"
                                    >
                                        <UploadCloud className="h-6 w-6 text-brand-subtext mb-1" />
                                    </div>
                                )}
                                <div className="text-xs text-brand-subtext font-medium leading-relaxed">
                                    <p>Recommended size 800×600</p>
                                    <p>Max file size: 2MB</p>
                                </div>
                            </div>
                        </div>

                        <ProductVideoUploader videos={videos} onChange={setVideos} />
                    </div>

                    {/* CARD 3: LOGISTICS & WARRANTY */}
                    <div className="rounded-xl border border-brand-subtext/20 bg-white p-6 shadow-sm flex flex-col gap-2">
                        <h3 className="text-sm font-bold text-brand-text uppercase tracking-wider border-b border-brand-subtext/10 pb-3">Logistics & Warranty</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div className="flex flex-col gap-3 rounded-lg border border-brand-subtext/10 bg-brand-bg/30 p-4 transition-all">
                                <div className="flex items-center justify-between">
                                    <label className={`${LABEL_CLASS} cursor-pointer`} onClick={() => setBookingMoneyEnabled(!bookingMoneyEnabled)}>Booking Money</label>
                                    <label className="flex cursor-pointer items-center">
                                        <input type="checkbox" checked={bookingMoneyEnabled} onChange={(e) => setBookingMoneyEnabled(e.target.checked)} className="peer sr-only" />
                                        <div className={SWITCH_TRACK}></div>
                                    </label>
                                </div>
                                {/* Off hides the amount here and on the storefront */}
                                {bookingMoneyEnabled && (
                                    <input type="number" value={bookingMoney} onChange={(e) => setBookingMoney(e.target.value)} placeholder="Booking Money" className={`${INPUT_CLASS} animate-in slide-in-from-top-2 fade-in duration-200`} />
                                )}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className={LABEL_CLASS}>Purchase Point</label>
                                <input type="text" value={purchasePoint} onChange={(e) => setPurchasePoint(e.target.value)} placeholder="Purchase Point" className={INPUT_CLASS} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div className="flex flex-col gap-1.5">
                                <label className={LABEL_CLASS}>Warranty Day</label>
                                <input type="number" value={warrantyDays} onChange={(e) => setWarrantyDays(e.target.value)} placeholder="Warranty Day" className={INPUT_CLASS} />
                            </div>
                            <div className="flex items-center justify-between rounded-lg border border-brand-subtext/10 bg-brand-bg/30 p-4">
                                <label className={`${LABEL_CLASS} cursor-pointer`} onClick={() => setWarrantyActive(!warrantyActive)}>Warranty Status</label>
                                <label className="flex cursor-pointer items-center">
                                    <input type="checkbox" checked={warrantyActive} onChange={(e) => setWarrantyActive(e.target.checked)} className="peer sr-only" />
                                    <div className={SWITCH_TRACK}></div>
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 rounded-lg border border-brand-subtext/10 bg-brand-bg/30 p-4 transition-all">
                            <div className="flex items-center justify-between">
                                <label className={`${LABEL_CLASS} cursor-pointer`} onClick={() => setHasWarrantyText(!hasWarrantyText)}>Warranty Care Text</label>
                                <label className="flex cursor-pointer items-center">
                                    <input type="checkbox" checked={hasWarrantyText} onChange={(e) => setHasWarrantyText(e.target.checked)} className="peer sr-only" />
                                    <div className={SWITCH_TRACK}></div>
                                </label>
                            </div>
                            {hasWarrantyText && (
                                <div className="flex flex-col gap-1.5 animate-in slide-in-from-top-2 fade-in duration-200">
                                    <CustomSelect value={warrantyCareTextId} onChange={setWarrantyCareTextId} options={textOptions} placeholder="Choose a warranty care text" />
                                    <span className="text-xs text-brand-subtext">Texts are managed globally on the Warranty Care Text page.</span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 rounded-lg border border-brand-subtext/10 bg-brand-bg/30 p-4 transition-all">
                            <div className="flex items-center justify-between">
                                <label className={`${LABEL_CLASS} cursor-pointer`} onClick={() => setHasServiceWarranty(!hasServiceWarranty)}>Service Warranty</label>
                                <label className="flex cursor-pointer items-center">
                                    <input type="checkbox" checked={hasServiceWarranty} onChange={(e) => setHasServiceWarranty(e.target.checked)} className="peer sr-only" />
                                    <div className={SWITCH_TRACK}></div>
                                </label>
                            </div>
                            {hasServiceWarranty && (
                                <input type="text" value={serviceWarranty} onChange={(e) => setServiceWarranty(e.target.value)} placeholder="Service Warranty" className={`${INPUT_CLASS} animate-in slide-in-from-top-2 fade-in duration-200`} />
                            )}
                        </div>
                    </div>

                    {/* CARD 4: PRODUCT VARIANTS */}
                    <div className="rounded-xl border border-brand-subtext/20 bg-white p-6 shadow-sm flex flex-col gap-4">
                        <h3 className="text-sm font-bold text-brand-text uppercase tracking-wider border-b border-brand-subtext/10 pb-3">Product Variants</h3>
                        <div className="pt-2">
                            <VariantsManager
                                options={variantOptions}
                                variants={variants}
                                drafts={variantDrafts}
                                onChange={(nextOptions, nextVariants) => {
                                    setVariantOptions(nextOptions);
                                    setVariants(nextVariants);
                                }}
                            />
                        </div>
                    </div>

                    {product && (
                        <div className="px-1 pt-2">
                            <AuditFooter
                                createdBy={product.createdBy}
                                createdAt={product.createdAt}
                                updatedBy={product.updatedBy}
                                updatedAt={product.updatedAt}
                            />
                        </div>
                    )}

                </div>
            </div>

            {/* Sticky Footer */}
            <div className="shrink-0 flex items-center justify-end gap-4 border-t border-brand-subtext/20 bg-white p-4 sm:px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <button type="button" onClick={onCancel} className="rounded-md px-6 py-2.5 text-sm font-medium text-brand-subtext hover:bg-brand-bg hover:text-brand-text transition-colors">
                    Cancel
                </button>
                <button type="submit" className="flex items-center gap-2 rounded-md bg-[#F59E0B] px-8 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#D97706]">
                    <Save className="h-4 w-4" />
                    {isEditMode ? "Update Product" : "Save"}
                </button>
            </div>
        </form>
    );
}

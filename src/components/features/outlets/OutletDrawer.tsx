"use client";
import { useState, useEffect } from "react";
import { OutletManagerType } from "@/hooks/outlet_hooks/useOutletManager";
import { OutletStatus } from "@/store/useOutletStore";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { RichTextEditor } from "@/components/shared/RichTextEditor";
import { ImagePlus, X } from "lucide-react";

const DAYS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "None"];

export function OutletDrawer({ manager }: { manager: OutletManagerType }) {
    const isEdit = manager.activeDrawer === "edit";
    const activeOutlet = manager.getActiveOutlet();

    // Basic Info
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<OutletStatus>("Active");

    // Location
    const [address, setAddress] = useState("");
    const [country, setCountry] = useState("Bangladesh");
    const [district, setDistrict] = useState("");
    const [thana, setThana] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [googleMapUrl, setGoogleMapUrl] = useState("");

    // Operations
    const [opens, setOpens] = useState("");
    const [closes, setCloses] = useState("");
    const [closeDay, setCloseDay] = useState("");
    const [description, setDescription] = useState("");

    // Gallery Array
    const [gallery, setGallery] = useState<string[]>([]);

    useEffect(() => {
        if (isEdit && activeOutlet) {
            setName(activeOutlet.name);
            setPhone(activeOutlet.phone);
            setEmail(activeOutlet.email);
            setStatus(activeOutlet.status);
            setAddress(activeOutlet.address);
            setCountry(activeOutlet.country);
            setDistrict(activeOutlet.district);
            setThana(activeOutlet.thana);
            setPostalCode(activeOutlet.postalCode);
            setGoogleMapUrl(activeOutlet.googleMapUrl);
            setOpens(activeOutlet.opens);
            setCloses(activeOutlet.closes);
            setCloseDay(activeOutlet.closeDay);
            setDescription(activeOutlet.description);
            setGallery([...activeOutlet.gallery]);
        } else if (manager.activeDrawer === "add") {
            setName("");
            setPhone("");
            setEmail("");
            setStatus("Active");
            setAddress("");
            setCountry("Bangladesh");
            setDistrict("");
            setThana("");
            setPostalCode("");
            setGoogleMapUrl("");
            setOpens("10:00"); // 24h format for standard html time input
            setCloses("22:00");
            setCloseDay("Wednesday");
            setDescription("");
            setGallery([]);
        }
    }, [isEdit, activeOutlet, manager.activeDrawer]);

    const handleAddGalleryMock = () => {
        setGallery(prev => [...prev, `mock-url-${Date.now()}`]);
    };

    const handleRemoveGalleryImage = (index: number) => {
        setGallery(prev => prev.filter((_, i) => i !== index));
    };

    const onSubmit = () => {
        manager.handleSubmit({
            name, phone, email, address, country, district, thana,
            postalCode, googleMapUrl, opens, closes, closeDay,
            description, image: null, gallery, status
        });
    };

    return (
        <Drawer
            title={isEdit ? "Update Outlet" : "Add Outlet"}
            isOpen={manager.activeDrawer !== "none"}
            onClose={manager.closeDrawer}
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 w-full flex flex-col gap-8 px-6 overflow-y-auto custom-scrollbar pb-12">

                    {/* Basic Info & Main Image */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label className="erp-label">Name <span className="text-red-500">*</span></label>
                                <input type="text" className="erp-input" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-1.5">
                                    <label className="erp-label">Phone</label>
                                    <input type="text" className="erp-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="erp-label">Email</label>
                                    <input type="email" className="erp-input" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <div className="lg:row-span-2 flex flex-col gap-1.5">
                            <label className="erp-label block">Image</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors">
                                <ImagePlus className="w-8 h-8 mb-2 text-gray-400" />
                                <span className="text-xs">Recommended: 800x600</span>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Location Details */}
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Address</label>
                        <textarea className="erp-input h-16 resize-none" value={address} onChange={(e) => setAddress(e.target.value)} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Country <span className="text-red-500">*</span></label>
                            <CustomSelect value={country} options={["Bangladesh", "India", "UAE"]} onChange={setCountry} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">District</label>
                            <CustomSelect value={district} options={["Dhaka", "Chittagong", "Sylhet"]} onChange={setDistrict} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Thana / Area</label>
                            <CustomSelect value={thana} options={["Vatara", "Gulshan", "Banani"]} onChange={setThana} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Postal Code</label>
                            <input type="text" className="erp-input" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <label className="erp-label">Google Map URL</label>
                            <input type="url" className="erp-input text-blue-600" value={googleMapUrl} onChange={(e) => setGoogleMapUrl(e.target.value)} />
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Operations */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Opens <span className="text-red-500">*</span></label>
                            <input type="time" className="erp-input" value={opens} onChange={(e) => setOpens(e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Closes <span className="text-red-500">*</span></label>
                            <input type="time" className="erp-input" value={closes} onChange={(e) => setCloses(e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Close Day <span className="text-red-500">*</span></label>
                            <CustomSelect value={closeDay} options={DAYS} onChange={setCloseDay} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Status</label>
                            <CustomSelect value={status} options={["Active", "Inactive"]} onChange={(val) => setStatus(val as OutletStatus)} />
                        </div>
                    </div>

                    <RichTextEditor label="Description" value={description} onChange={setDescription} />

                    {/* Dynamic Outlet Gallery */}
                    <div className="flex flex-col gap-3 mt-4 border border-gray-100 rounded-lg p-5 bg-gray-50/50">
                        <div className="flex items-center justify-between">
                            <label className="erp-label m-0 font-bold text-gray-800">Outlet Images</label>
                            <Button type="button" variant="outline" size="sm" onClick={handleAddGalleryMock} className="h-8 border-brand-primary text-brand-primary">
                                Add Image
                            </Button>
                        </div>
                        {gallery.length === 0 ? (
                            <div className="text-center text-gray-400 text-xs py-4">Nothing to show here</div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                                {gallery.map((img, index) => (
                                    <div key={index} className="relative group rounded border border-gray-200 overflow-hidden bg-white aspect-[4/3] flex flex-col items-center justify-center">
                                        <ImagePlus className="w-6 h-6 text-gray-300" />
                                        <span className="text-[10px] text-gray-400 mt-1">Image {index + 1}</span>
                                        <button
                                            onClick={() => handleRemoveGalleryImage(index)}
                                            className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow-sm text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white mt-auto shrink-0 px-6 pb-4">
                    <Button variant="outline" onClick={manager.closeDrawer} className="px-6 h-9">Cancel</Button>
                    <Button variant="default" onClick={onSubmit} className="px-8 h-9">
                        {isEdit ? "Update Outlet" : "Submit"}
                    </Button>
                </div>
            </div>
        </Drawer>
    );
}
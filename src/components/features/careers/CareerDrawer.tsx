"use client";
import { useState, useEffect } from "react";
import { CareerManagerType } from "@/hooks/career_hooks/useCareerManager";
import { JobType, CareerStatus } from "@/store/useCareerStore";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { DatePicker } from "@/components/ui/DatePicker";
import { ImagePlus, Bold, Italic, Underline, Link2, List, ListOrdered } from "lucide-react";

// Mock Rich Text Editor primitive to represent the WYSIWYG requirement
function MockRichTextEditor({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="erp-label">{label}</label>
            <div className="border border-gray-200 rounded-md overflow-hidden bg-white focus-within:border-brand-primary focus-within:ring-1 focus-within:ring-brand-primary transition-shadow">
                <div className="flex items-center gap-2 bg-gray-50 border-b border-gray-200 p-2">
                    <button type="button" className="p-1 hover:bg-gray-200 rounded text-gray-600"><Bold className="w-4 h-4" /></button>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded text-gray-600"><Italic className="w-4 h-4" /></button>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded text-gray-600"><Underline className="w-4 h-4" /></button>
                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded text-gray-600"><List className="w-4 h-4" /></button>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded text-gray-600"><ListOrdered className="w-4 h-4" /></button>
                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded text-gray-600"><Link2 className="w-4 h-4" /></button>
                </div>
                <textarea
                    className="w-full h-32 p-3 text-sm text-gray-800 focus:outline-none resize-none"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Enter rich text content here..."
                />
            </div>
        </div>
    );
}

export function CareerDrawer({ manager }: { manager: CareerManagerType }) {
    const isEdit = manager.activeDrawer === "edit";
    const activeCareer = manager.getActiveCareer();

    // Form State
    const [heading, setHeading] = useState("");
    const [vacancies, setVacancies] = useState<number>(1);
    const [type, setType] = useState<JobType>("Full Time");
    const [salary, setSalary] = useState("");
    const [deadline, setDeadline] = useState("");
    const [description, setDescription] = useState("");
    const [qualification, setQualification] = useState("");
    const [benefits, setBenefits] = useState("");
    const [keywords, setKeywords] = useState("");
    const [status, setStatus] = useState<CareerStatus>("Active");

    useEffect(() => {
        if (isEdit && activeCareer) {
            setHeading(activeCareer.heading);
            setVacancies(activeCareer.vacancies);
            setType(activeCareer.type);
            setSalary(activeCareer.salary);
            setDeadline(activeCareer.deadline);
            setDescription(activeCareer.description);
            setQualification(activeCareer.qualification);
            setBenefits(activeCareer.benefits);
            setKeywords(activeCareer.keywords);
            setStatus(activeCareer.status);
        } else if (manager.activeDrawer === "add") {
            // Reset for Add mode
            setHeading("");
            setVacancies(1);
            setType("Full Time");
            setSalary("");
            setDeadline("");
            setDescription("");
            setQualification("");
            setBenefits("");
            setKeywords("");
            setStatus("Active");
        }
    }, [isEdit, activeCareer, manager.activeDrawer]);

    const onSubmit = () => {
        manager.handleSubmit({
            heading,
            image: null, // Simulated media block
            vacancies,
            type,
            salary,
            deadline: deadline || new Date().toISOString(),
            description,
            qualification,
            benefits,
            keywords,
            status
        });
    };

    return (
        <Drawer
            title={isEdit ? "Update Career" : "Add Career"}
            isOpen={manager.activeDrawer !== "none"}
            onClose={manager.closeDrawer}
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 w-full flex flex-col gap-8 px-6 overflow-y-auto custom-scrollbar pb-12">

                    {/* Top Section: Basic Info & Image */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 flex flex-col gap-1.5">
                            <label className="erp-label">Heading <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                className="erp-input"
                                value={heading}
                                onChange={(e) => setHeading(e.target.value)}
                                placeholder="e.g., Next.js Developer"
                            />
                        </div>

                        <div className="lg:row-span-2">
                            <label className="erp-label mb-1.5 block">Image</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-brand-primary cursor-pointer transition-colors">
                                <ImagePlus className="w-8 h-8 mb-2 text-gray-400" />
                                <span className="text-xs">Recommended size: 800x600</span>
                                <span className="text-[10px] text-gray-400">Max file size: 2MB</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Vacancies</label>
                            <input
                                type="number"
                                className="erp-input"
                                value={vacancies}
                                onChange={(e) => setVacancies(Number(e.target.value))}
                                min={1}
                            />
                        </div>
                    </div>

                    {/* Middle Section: Specs */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Type</label>
                            <CustomSelect
                                value={type}
                                options={["Full Time", "Part Time", "Contract", "Internship"]}
                                onChange={(val) => setType(val as JobType)}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Salary</label>
                            <input
                                type="text"
                                className="erp-input"
                                value={salary}
                                onChange={(e) => setSalary(e.target.value)}
                                placeholder="e.g., BDT 25,000 - 30,000"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Deadline</label>
                            <DatePicker
                                value={deadline ? deadline.split("T")[0] : ""}
                                onChange={(val: string) => {
                                    setDeadline(val ? new Date(val).toISOString() : "");
                                }}
                            />
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Bottom Section: Rich Text & SEO */}
                    <MockRichTextEditor label="Job Description" value={description} onChange={setDescription} />
                    <MockRichTextEditor label="Qualification / Required Skills" value={qualification} onChange={setQualification} />
                    <MockRichTextEditor label="Benefits" value={benefits} onChange={setBenefits} />

                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Keywords (SEO)</label>
                        <textarea
                            className="erp-input h-20 resize-none"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            placeholder="e.g., next.js developer, frontend..."
                        />
                    </div>

                    <div className="flex flex-col gap-1.5 w-64">
                        <label className="erp-label">Job Status</label>
                        <CustomSelect
                            value={status}
                            options={["Active", "Inactive"]}
                            onChange={(val) => setStatus(val as CareerStatus)}
                        />
                    </div>

                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white mt-auto shrink-0 px-6 pb-4">
                    <Button variant="outline" onClick={manager.closeDrawer} className="px-6 h-9">Cancel</Button>
                    <Button variant="default" onClick={onSubmit} className="px-8 h-9">
                        {isEdit ? "Update Career" : "Save Career"}
                    </Button>
                </div>
            </div>
        </Drawer>
    );
}
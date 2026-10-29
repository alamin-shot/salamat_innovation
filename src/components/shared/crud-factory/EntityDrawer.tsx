"use client";
import { useState, useEffect } from "react";
import { GenericManagerType } from "@/hooks/crud_hooks/useGenericManager";
import { EntitySchemaField } from "./EntityTable";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Image as ImageIcon } from "lucide-react";

interface EntityDrawerProps {
    title: string;
    schema: EntitySchemaField[];
    manager: GenericManagerType;
}

export function EntityDrawer({ title, schema, manager }: EntityDrawerProps) {
    const isEditing = manager.activeDrawer === "edit";
    const activeEntity = manager.getActiveEntity();
    const [formData, setFormData] = useState<Record<string, any>>({});

    useEffect(() => {
        if (isEditing && activeEntity) {
            setFormData({ ...activeEntity });
        } else if (manager.activeDrawer === "add") {
            const initial: Record<string, any> = {};
            schema.forEach(s => { initial[s.key] = s.type === "number" ? 0 : ""; });
            setFormData(initial);
        }
    }, [isEditing, activeEntity, manager.activeDrawer, schema]);

    const handleSubmit = () => {
        // Basic validation for required fields
        for (const field of schema) {
            if (field.required && !formData[field.key]) {
                alert(`${field.label} is required.`);
                return;
            }
        }
        manager.handleSubmit(formData);
    };

    const renderField = (field: EntitySchemaField) => {
        const value = formData[field.key] || "";
        const setValue = (val: any) => setFormData(prev => ({ ...prev, [field.key]: val }));

        switch (field.type) {
            case "select":
                return (
                    <CustomSelect
                        value={value}
                        onChange={setValue}
                        options={field.options || []}
                        placeholder={`Select ${field.label}`}
                    />
                );
            case "image":
                return (
                    <div className="border-2 border-dashed border-gray-200 rounded-lg h-32 flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-brand-primary/5 cursor-pointer transition-colors">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                        <span className="text-xs text-gray-500">Click to upload {field.label}</span>
                    </div>
                );
            case "textarea":
                return (
                    <textarea
                        className="erp-input h-24 resize-none"
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder={`Enter ${field.label}`}
                    />
                );
            case "number":
                return (
                    <input
                        type="number"
                        className="erp-input"
                        value={value}
                        onChange={e => setValue(parseFloat(e.target.value) || 0)}
                    />
                );
            default:
                return (
                    <input
                        type={field.type}
                        className="erp-input"
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder={`Enter ${field.label}`}
                    />
                );
        }
    };

    return (
        <Drawer
            title={`${isEditing ? "Update" : "Add"} ${title}`}
            isOpen={manager.activeDrawer !== "none"}
            onClose={manager.closeDrawer}
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 max-w-3xl mx-auto w-full flex flex-col gap-6 px-4 overflow-y-auto custom-scrollbar pb-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {schema.map(field => (
                            <div
                                key={field.key}
                                className={`flex flex-col gap-1.5 ${field.type === "textarea" || field.type === "url" ? "sm:col-span-2" : ""}`}
                            >
                                <label className="erp-label">
                                    {field.label} {field.required && <span className="text-red-500">*</span>}
                                </label>
                                {renderField(field)}
                            </div>
                        ))}
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
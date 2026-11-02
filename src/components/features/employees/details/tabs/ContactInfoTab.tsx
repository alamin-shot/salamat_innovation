"use client";
import { EmployeeDetailManagerType } from "@/hooks/employee_hooks/useEmployeeDetailManager";
import { ContactEditDrawer } from "../drawers/ContactEditDrawer";
import { Button } from "@/components/ui/Button";
import { User, Phone, Mail, Edit } from "lucide-react";

export function ContactInfoTab({ manager }: { manager: EmployeeDetailManagerType }) {
    const emp = manager.employee;
    const { personContact, emergencyContact } = emp;

    return (
        <div className="erp-card bg-white p-6 shadow-sm relative">
            <div className="border-b border-gray-100 pb-4 mb-6 flex justify-between items-start">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Contact Information</h2>
                    <p className="text-xs text-gray-500 mt-1">Manage employee and emergency contact details</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => manager.setActiveSubDrawer("edit_contact")} className="h-8 border-brand-primary text-brand-primary">
                    <Edit className="w-3.5 h-3.5 mr-2" /> Edit Contacts
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-blue-100 rounded-lg p-5 bg-blue-50/30">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-sm">Person Contact</h3>
                            <p className="text-xs text-gray-500">Primary contact information</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-gray-500"><User className="w-4 h-4" /> Full Name</div>
                            <div className="font-medium text-gray-900">{personContact.fullName || <span className="text-gray-300 italic text-xs">Not provided</span>}</div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-gray-500"><Mail className="w-4 h-4" /> Email Address</div>
                            <div className="font-medium text-gray-900">{personContact.emailAddress || <span className="text-gray-300 italic text-xs">Not provided</span>}</div>
                        </div>
                    </div>
                </div>

                <div className="border border-rose-100 rounded-lg p-5 bg-rose-50/30">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                            <Phone className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-sm">Emergency Contact</h3>
                            <p className="text-xs text-gray-500">Contact in case of emergency</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-gray-500"><User className="w-4 h-4" /> Full Name</div>
                            <div className="font-medium text-gray-900">{emergencyContact.fullName || <span className="text-gray-300 italic text-xs">Not provided</span>}</div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-gray-500"><User className="w-4 h-4" /> Relation</div>
                            <div className="font-medium text-gray-900">{emergencyContact.relation || <span className="text-gray-300 italic text-xs">Not provided</span>}</div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-gray-500"><Phone className="w-4 h-4" /> Phone Number</div>
                            <div className="font-medium text-gray-900">{emergencyContact.phoneNumber || <span className="text-gray-300 italic text-xs">Not provided</span>}</div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-gray-500"><Mail className="w-4 h-4" /> Email Address</div>
                            <div className="font-medium text-gray-900">{emergencyContact.emailAddress || <span className="text-gray-300 italic text-xs">Not provided</span>}</div>
                        </div>
                    </div>
                </div>
            </div>

            <ContactEditDrawer manager={manager} />
        </div>
    );
}
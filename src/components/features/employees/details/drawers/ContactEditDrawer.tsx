"use client";
import { useState, useEffect } from "react";
import { EmployeeDetailManagerType } from "@/hooks/employee_hooks/useEmployeeDetailManager";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";

export function ContactEditDrawer({ manager }: { manager: EmployeeDetailManagerType }) {
    const isOpen = manager.activeSubDrawer === "edit_contact";
    const emp = manager.employee;

    const [pName, setPName] = useState(emp.personContact.fullName);
    const [pEmail, setPEmail] = useState(emp.personContact.emailAddress);

    const [eName, setEName] = useState(emp.emergencyContact.fullName);
    const [eRelation, setERelation] = useState(emp.emergencyContact.relation);
    const [ePhone, setEPhone] = useState(emp.emergencyContact.phoneNumber);
    const [eEmail, setEEmail] = useState(emp.emergencyContact.emailAddress);

    useEffect(() => {
        if (isOpen) {
            setPName(emp.personContact.fullName);
            setPEmail(emp.personContact.emailAddress);
            setEName(emp.emergencyContact.fullName);
            setERelation(emp.emergencyContact.relation);
            setEPhone(emp.emergencyContact.phoneNumber);
            setEEmail(emp.emergencyContact.emailAddress);
        }
    }, [isOpen, emp]);

    const handleSave = () => {
        manager.saveContactInfo(
            { fullName: pName, emailAddress: pEmail },
            { fullName: eName, relation: eRelation, phoneNumber: ePhone, emailAddress: eEmail }
        );
    };

    return (
        <Drawer title="Edit Contact Information" isOpen={isOpen} onClose={manager.closeSubDrawer} width="w-full sm:w-[500px]">
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 px-6 overflow-y-auto custom-scrollbar pb-12 flex flex-col gap-8">

                    <div className="flex flex-col gap-4">
                        <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Person Contact
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="erp-label">Full Name</label>
                                <input type="text" className="erp-input" placeholder="Enter full name" value={pName} onChange={(e) => setPName(e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="erp-label">Email Address</label>
                                <input type="email" className="erp-input" placeholder="Enter email address" value={pEmail} onChange={(e) => setPEmail(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-rose-500"></span> Emergency Contact
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="erp-label">Full Name</label>
                                <input type="text" className="erp-input" placeholder="Enter emergency contact name" value={eName} onChange={(e) => setEName(e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="erp-label">Relation</label>
                                <input type="text" className="erp-input" placeholder="e.g. Father, Spouse" value={eRelation} onChange={(e) => setERelation(e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="erp-label">Phone Number</label>
                                <input type="text" className="erp-input" placeholder="Enter phone number" value={ePhone} onChange={(e) => setEPhone(e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="erp-label">Email Address</label>
                                <input type="email" className="erp-input" placeholder="Enter email address" value={eEmail} onChange={(e) => setEEmail(e.target.value)} />
                            </div>
                        </div>
                    </div>

                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white px-6 pb-4">
                    <Button variant="outline" onClick={manager.closeSubDrawer}>Cancel</Button>
                    <Button variant="default" onClick={handleSave}>Save Changes</Button>
                </div>
            </div>
        </Drawer>
    );
}
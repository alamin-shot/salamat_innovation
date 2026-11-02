"use client";
import { useState, useEffect } from "react";
import { EmployeeDetailManagerType } from "@/hooks/employee_hooks/useEmployeeDetailManager";
import { GenderType, MaritalStatusType } from "@/types/employee.types";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";

export function PersonalInfoTab({ manager }: { manager: EmployeeDetailManagerType }) {
    const emp = manager.employee;

    const [name, setName] = useState(emp.name);
    const [email, setEmail] = useState(emp.email);
    const [phone, setPhone] = useState(emp.phone);
    const [dateOfBirth, setDateOfBirth] = useState(emp.dateOfBirth);
    const [placeOfBirth, setPlaceOfBirth] = useState(emp.placeOfBirth);
    const [gender, setGender] = useState<GenderType>(emp.gender);
    const [maritalStatus, setMaritalStatus] = useState<MaritalStatusType>(emp.maritalStatus);
    const [religion, setReligion] = useState(emp.religion || "select_an_item");
    const [bloodType, setBloodType] = useState(emp.bloodType || "select_an_item");
    const [nidNo, setNidNo] = useState(emp.nidNo);
    const [tinNo, setTinNo] = useState(emp.tinNo);

    // Keep synced if user navigates rapidly
    useEffect(() => {
        setName(emp.name);
        setEmail(emp.email);
        setPhone(emp.phone);
        setDateOfBirth(emp.dateOfBirth);
        setPlaceOfBirth(emp.placeOfBirth);
        setGender(emp.gender);
        setMaritalStatus(emp.maritalStatus);
        setReligion(emp.religion || "select_an_item");
        setBloodType(emp.bloodType || "select_an_item");
        setNidNo(emp.nidNo);
        setTinNo(emp.tinNo);
    }, [emp]);

    const handleSave = () => {
        manager.savePersonalInfo({
            name, email, phone, dateOfBirth, placeOfBirth,
            gender, maritalStatus, religion, bloodType, nidNo, tinNo
        });
    };

    return (
        <div className="erp-card bg-white p-6 shadow-sm">
            <div className="border-b border-gray-100 pb-4 mb-6">
                <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
                <p className="text-xs text-gray-500 mt-1">Manage the employee&apos;s personal details</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex flex-col gap-1.5">
                    <label className="erp-label">Full Name <span className="text-red-500">*</span></label>
                    <input type="text" className="erp-input" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="erp-label">Email</label>
                    <input type="email" className="erp-input" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="erp-label">Phone Number</label>
                    <input type="text" className="erp-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="erp-label">Date of Birth</label>
                    <input type="date" className="erp-input text-gray-700" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="flex flex-col gap-1.5">
                    <label className="erp-label">Place of Birth</label>
                    <input type="text" className="erp-input" placeholder="Enter place of birth" value={placeOfBirth} onChange={(e) => setPlaceOfBirth(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="erp-label">Gender</label>
                    <div className="flex items-center gap-4 h-[38px] px-3 border border-gray-200 rounded-md bg-white">
                        {(["Male", "Female", "Others"] as GenderType[]).map((g) => (
                            <label key={g} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                <input type="radio" checked={gender === g} onChange={() => setGender(g)} className="text-brand-primary" /> {g}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-1.5 lg:col-span-2">
                    <label className="erp-label">Marital Status</label>
                    <div className="flex flex-wrap items-center gap-6 h-[38px] px-3 border border-gray-200 rounded-md bg-white w-full">
                        {(["Single", "Married", "Divorced", "Widowed"] as MaritalStatusType[]).map((m) => (
                            <label key={m} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                <input type="radio" checked={maritalStatus === m} onChange={() => setMaritalStatus(m)} className="text-brand-primary" /> {m}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div className="flex flex-col gap-1.5">
                    <label className="erp-label">Religion</label>
                    <CustomSelect value={religion} options={["select_an_item", "Islam", "Hinduism", "Christianity", "Buddhism", "Others"]} onChange={setReligion} />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="erp-label">Blood Type</label>
                    <CustomSelect value={bloodType} options={["select_an_item", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]} onChange={setBloodType} />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="erp-label">NID No</label>
                    <input type="text" className="erp-input" placeholder="Enter NID number" value={nidNo} onChange={(e) => setNidNo(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="erp-label">TIN No</label>
                    <input type="text" className="erp-input" placeholder="Enter TIN number" value={tinNo} onChange={(e) => setTinNo(e.target.value)} />
                </div>
            </div>

            <div className="pt-2">
                <Button variant="default" onClick={handleSave} className="px-6">Save Changes</Button>
            </div>
        </div>
    );
}
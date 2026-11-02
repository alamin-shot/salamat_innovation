"use client";
import { useState, useEffect } from "react";
import { EmployeeManagerType } from "@/hooks/employee_hooks/useEmployeeManager";
import { GenderType, AccountStatus } from "@/types/employee.types";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { MultiSelect } from "@/components/shared/MultiSelect";

export function EmployeeFormDrawer({ manager }: { manager: EmployeeManagerType }) {
    const isEdit = manager.activeDrawer === "edit";
    const activeEmp = manager.getActiveEmployee();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState<GenderType>("Male");
    const [designation, setDesignation] = useState("");
    const [department, setDepartment] = useState("");
    const [employeeStatus, setEmployeeStatus] = useState("Probation");
    const [joiningDate, setJoiningDate] = useState("");
    const [salary, setSalary] = useState<number>(0);
    const [assignedShops, setAssignedShops] = useState<string[]>([]);
    const [role, setRole] = useState("");
    const [workShift, setWorkShift] = useState("Showroom");
    const [status, setStatus] = useState<AccountStatus>("Active");

    useEffect(() => {
        if (isEdit && activeEmp) {
            setName(activeEmp.name);
            setEmail(activeEmp.email);
            setPhone(activeEmp.phone);
            setGender(activeEmp.gender);
            setDesignation(activeEmp.designation);
            setDepartment(activeEmp.department);
            setEmployeeStatus(activeEmp.employeeStatus);
            setJoiningDate(activeEmp.joiningDate);
            setSalary(activeEmp.salary);
            setAssignedShops([...activeEmp.assignedShops]);
            setRole(activeEmp.role);
            setWorkShift(activeEmp.workShift);
            setStatus(activeEmp.status);
        } else if (manager.activeDrawer === "add") {
            setName("");
            setEmail("");
            setPhone("");
            setGender("Male");
            setDesignation(manager.designations[0] || "");
            setDepartment(manager.departments[0] || "");
            setEmployeeStatus("Probation");
            setJoiningDate(new Date().toISOString().slice(0, 10));
            setSalary(20000);
            setAssignedShops(["A-Block"]);
            setRole(manager.roles[0] || "");
            setWorkShift("Showroom");
            setStatus("Active");
        }
    }, [isEdit, activeEmp, manager.activeDrawer, manager.designations, manager.departments, manager.roles]);

    const onSubmit = () => {
        manager.handleSubmit({
            name,
            email,
            phone,
            gender,
            designation,
            department,
            employeeStatus,
            joiningDate,
            salary,
            assignedShops,
            role,
            workShift,
            status
        });
    };

    return (
        <Drawer
            title={isEdit ? "Update Employee Record" : "Add Employee"}
            isOpen={manager.activeDrawer !== "none"}
            onClose={manager.closeDrawer}
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 w-full flex flex-col gap-6 px-6 overflow-y-auto custom-scrollbar pb-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                className="erp-input"
                                placeholder="Enter employee name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Email <span className="text-red-500">*</span></label>
                            <input
                                type="email"
                                className="erp-input"
                                placeholder="Enter email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Phone Number</label>
                            <input
                                type="text"
                                className="erp-input"
                                placeholder="+880 1XXX-XXXXXX"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Gender <span className="text-red-500">*</span></label>
                            <div className="flex items-center gap-4 h-[38px] px-3 border border-gray-200 rounded-md bg-white">
                                {(["Male", "Female", "Others"] as GenderType[]).map((g) => (
                                    <label key={g} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="genderRadio"
                                            checked={gender === g}
                                            onChange={() => setGender(g)}
                                            className="text-brand-primary"
                                        />
                                        {g}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Designation <span className="text-red-500">*</span></label>
                            <CustomSelect value={designation} options={manager.designations} onChange={setDesignation} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Department <span className="text-red-500">*</span></label>
                            <CustomSelect value={department} options={manager.departments} onChange={setDepartment} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Employee Status <span className="text-red-500">*</span></label>
                            <CustomSelect value={employeeStatus} options={manager.employeeStatuses} onChange={setEmployeeStatus} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Joining Date <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                className="erp-input"
                                value={joiningDate}
                                onChange={(e) => setJoiningDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Base Salary ($) <span className="text-red-500">*</span></label>
                            <input
                                type="number"
                                className="erp-input"
                                min={0}
                                value={salary}
                                onChange={(e) => setSalary(Number(e.target.value))}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Work Shift</label>
                            <CustomSelect value={workShift} options={["Showroom", "Head Office", "Remote"]} onChange={setWorkShift} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Account Status</label>
                            <CustomSelect value={status} options={["Active", "Inactive"]} onChange={(val) => setStatus(val as AccountStatus)} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Role Title <span className="text-red-500">*</span></label>
                            <CustomSelect value={role} options={manager.roles} onChange={setRole} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Assigned Shops / Tenants</label>
                            <MultiSelect value={assignedShops} options={manager.shops} onChange={setAssignedShops} placeholder="Select outlets..." />
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white mt-auto shrink-0 px-6 pb-4">
                    <Button variant="outline" onClick={manager.closeDrawer} className="px-6 h-9">Cancel</Button>
                    <Button variant="default" onClick={onSubmit} className="px-8 h-9">
                        {isEdit ? "Update Employee" : "Save Employee"}
                    </Button>
                </div>
            </div>
        </Drawer>
    );
}
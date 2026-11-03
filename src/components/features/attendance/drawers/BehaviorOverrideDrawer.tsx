"use client";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { GlobalAttendanceLog, AttendanceBehavior, AttendanceRecordStatus } from "@/types/attendance.types";

interface BehaviorOverrideDrawerProps {
    overrideTarget: GlobalAttendanceLog | null;
    setOverrideTarget: (target: GlobalAttendanceLog | null) => void;
    overrideBehavior: AttendanceBehavior;
    setOverrideBehavior: (val: AttendanceBehavior) => void;
    overrideStatus: AttendanceRecordStatus;
    setOverrideStatus: (val: AttendanceRecordStatus) => void;
    auditReason: string;
    setAuditReason: (val: string) => void;
    handleSaveOverride: () => void;
}

export function BehaviorOverrideDrawer({
    overrideTarget,
    setOverrideTarget,
    overrideBehavior,
    setOverrideBehavior,
    overrideStatus,
    setOverrideStatus,
    auditReason,
    setAuditReason,
    handleSaveOverride
}: BehaviorOverrideDrawerProps) {
    return (
        <Drawer
            title={`Override Behavior — ${overrideTarget?.employeeName || ""}`}
            isOpen={!!overrideTarget}
            onClose={() => setOverrideTarget(null)}
            width="drawer-full-content"
        >
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 px-6 flex flex-col gap-5 max-w-xl">
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Behavior Classification</label>
                        <CustomSelect
                            value={overrideBehavior}
                            options={["regular", "late", "early", "absent"]}
                            onChange={(val) => setOverrideBehavior(val as AttendanceBehavior)}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Approval Status</label>
                        <CustomSelect
                            value={overrideStatus}
                            options={["Approved", "Pending", "Rejected"]}
                            onChange={(val) => setOverrideStatus(val as AttendanceRecordStatus)}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">
                            Mandatory Audit Trail Reason <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            className="erp-input min-h-[100px] py-2"
                            placeholder="State why this punch behavior is being manually overridden..."
                            value={auditReason}
                            onChange={(e) => setAuditReason(e.target.value)}
                        />
                    </div>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white px-6 pb-4 mt-auto">
                    <Button variant="outline" onClick={() => setOverrideTarget(null)}>Cancel</Button>
                    <Button variant="default" onClick={handleSaveOverride}>Save Override</Button>
                </div>
            </div>
        </Drawer>
    );
}
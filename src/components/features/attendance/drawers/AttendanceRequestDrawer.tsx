"use client";
import { useState, useEffect } from "react";
import { AttendanceRequestsManagerType } from "@/hooks/attendance_hooks/useAttendanceRequestsManager";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";

export function AttendanceRequestDrawer({ manager }: { manager: AttendanceRequestsManagerType }) {
    const isOpen = manager.activeDrawer !== "none";
    const isEdit = manager.activeDrawer === "edit";
    const req = manager.getActiveRequest();

    const [date, setDate] = useState("");
    const [punchIn, setPunchIn] = useState("");
    const [punchOut, setPunchOut] = useState("");
    const [note, setNote] = useState("");

    useEffect(() => {
        if (isEdit && req) {
            setDate(req.date);
            setPunchIn(req.punchIn);
            setPunchOut(req.punchOut);
            setNote(req.note);
        } else if (manager.activeDrawer === "add") {
            setDate(new Date().toISOString().slice(0, 10));
            setPunchIn("");
            setPunchOut("");
            setNote("");
        }
    }, [isEdit, req, manager.activeDrawer]);

    const handleSave = () => {
        manager.handleSubmit({
            employeeId: "3378", employeeName: "Yasin Hasan",
            date, punchIn, punchOut, note, status: "Pending"
        });
    };

    return (
        <Drawer title={isEdit ? "Update Request" : "Add Attendance Request"} isOpen={isOpen} onClose={manager.closeDrawer} width="w-full sm:w-[calc(100vw-260px)]">
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 px-6 overflow-y-auto custom-scrollbar pb-12 flex flex-col gap-6">
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Date <span className="text-red-500">*</span></label>
                        <input type="date" className="erp-input text-gray-700" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Punch In</label>
                            <input type="time" className="erp-input" value={punchIn} onChange={(e) => setPunchIn(e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Punch Out</label>
                            <input type="time" className="erp-input" value={punchOut} onChange={(e) => setPunchOut(e.target.value)} />
                        </div>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold -mt-3">Enter at least one of Punch In or Punch Out.</p>
                    <div className="flex flex-col gap-1.5 mt-2">
                        <label className="erp-label">Note</label>
                        <textarea className="erp-input min-h-[100px] resize-none py-2" placeholder="Write your note here" value={note} onChange={(e) => setNote(e.target.value)} />
                    </div>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white px-6 pb-4 mt-auto">
                    <Button variant="outline" onClick={manager.closeDrawer}>Cancel</Button>
                    <Button variant="default" onClick={handleSave}>Save</Button>
                </div>
            </div>
        </Drawer>
    );
}
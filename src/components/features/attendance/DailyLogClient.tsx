"use client";
import { useState, useMemo } from "react";
import { useGlobalAttendanceStore } from "@/store/useGlobalAttendanceStore";
import { GlobalAttendanceLog, AttendanceBehavior, AttendanceRecordStatus } from "@/types/attendance.types";
import { PunchLocationDrawer } from "./drawers/PunchLocationDrawer";
import { SelfieVerificationDrawer } from "./drawers/SelfieVerificationDrawer";
import { DailyLogHeader } from "./daily-log/DailyLogHeader";
import { DailyLogTable } from "./daily-log/DailyLogTable";
import { BehaviorOverrideDrawer } from "./drawers/BehaviorOverrideDrawer";
import { toast } from "sonner";

export function DailyLogClient() {
    const store = useGlobalAttendanceStore();

    const [searchQuery, setSearchQuery] = useState("");
    const [behaviorFilter, setBehaviorFilter] = useState("All Behaviors");
    const [showColumnsMenu, setShowColumnsMenu] = useState(false);
    const [expandedIds, setExpandedIds] = useState<string[]>([]);

    const [visibleCols, setVisibleCols] = useState<Record<string, boolean>>({
        punchIn: true,
        inSelfie: true,
        inLocation: true,
        outLocation: true,
        punchOut: true,
        outSelfie: true,
        behavior: true,
        breakTimes: true,
        totalHours: true
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    // Drawers State
    const [locationDrawerData, setLocationDrawerData] = useState<any | null>(null);
    const [selfieAuditData, setSelfieAuditData] = useState<any | null>(null);
    const [overrideTarget, setOverrideTarget] = useState<GlobalAttendanceLog | null>(null);
    const [overrideBehavior, setOverrideBehavior] = useState<AttendanceBehavior>("regular");
    const [overrideStatus, setOverrideStatus] = useState<AttendanceRecordStatus>("Approved");
    const [auditReason, setAuditReason] = useState("");

    const filteredLogs = useMemo(() => {
        return store.globalLogs.filter((log) => {
            const matchesSearch =
                log.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.empCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.inLocation.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesBehavior =
                behaviorFilter === "All Behaviors" || log.behavior === behaviorFilter.toLowerCase();
            return matchesSearch && matchesBehavior;
        });
    }, [store.globalLogs, searchQuery, behaviorFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredLogs.length / perPage));
    const paginatedLogs = filteredLogs.slice((currentPage - 1) * perPage, currentPage * perPage);

    const toggleExpand = (id: string) => {
        setExpandedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    };

    const getBehaviorBadge = (behavior: string) => {
        if (behavior === "late") return "bg-rose-50 text-rose-600 border-rose-200";
        if (behavior === "early") return "bg-cyan-50 text-cyan-600 border-cyan-200";
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
    };

    const handleSaveOverride = () => {
        if (!overrideTarget || !auditReason.trim()) {
            toast.error("Please provide an audit trail reason");
            return;
        }
        store.overrideLogBehavior(overrideTarget.id, overrideBehavior, overrideStatus, auditReason);
        toast.success(`Updated behavior for ${overrideTarget.employeeName}`);
        setOverrideTarget(null);
        setAuditReason("");
    };

    return (
        <div className="flex flex-col w-full h-full gap-2 p-4">

            <DailyLogHeader
                behaviorFilter={behaviorFilter}
                setBehaviorFilter={setBehaviorFilter}
                showColumnsMenu={showColumnsMenu}
                setShowColumnsMenu={setShowColumnsMenu}
                visibleCols={visibleCols}
                setVisibleCols={setVisibleCols}
            />

            <DailyLogTable
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                paginatedLogs={paginatedLogs}
                visibleCols={visibleCols}
                expandedIds={expandedIds}
                toggleExpand={toggleExpand}
                getBehaviorBadge={getBehaviorBadge}
                setLocationDrawerData={setLocationDrawerData}
                setSelfieAuditData={setSelfieAuditData}
                setOverrideTarget={setOverrideTarget}
                setOverrideBehavior={setOverrideBehavior}
                setOverrideStatus={setOverrideStatus}
                currentPage={currentPage}
                totalPages={totalPages}
                perPage={perPage}
                setCurrentPage={setCurrentPage}
                setPerPage={setPerPage}
            />

            <PunchLocationDrawer
                locationData={locationDrawerData}
                onClose={() => setLocationDrawerData(null)}
            />
            <SelfieVerificationDrawer
                data={selfieAuditData}
                onClose={() => setSelfieAuditData(null)}
            />
            <BehaviorOverrideDrawer
                overrideTarget={overrideTarget}
                setOverrideTarget={setOverrideTarget}
                overrideBehavior={overrideBehavior}
                setOverrideBehavior={setOverrideBehavior}
                overrideStatus={overrideStatus}
                setOverrideStatus={setOverrideStatus}
                auditReason={auditReason}
                setAuditReason={setAuditReason}
                handleSaveOverride={handleSaveOverride}
            />
        </div>
    );
}
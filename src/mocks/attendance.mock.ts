import { GlobalAttendanceLog, AttendanceRequest, BreakTimeConfig } from "@/types/attendance.types";

export const MOCK_ATTENDANCE_LOGS: GlobalAttendanceLog[] = [
    {
        id: "att-101", employeeId: "3347", employeeName: "Md Zihadul Islam Sazzad", empCode: "EMP-3347",
        date: "02 Nov 2026", isoDate: "2026-11-02", leave: "-", punchIn: "02:18 PM",
        inLocation: "202.134.11.246", inCoordinates: "23.81333, 90.42318", punchOut: "—",
        outLocation: "—", outCoordinates: "", behavior: "late", breakTimes: "0:00:00", totalHours: "0:00:00",
        workShift: "Showroom", status: "Approved"
    },
    {
        id: "att-102", employeeId: "3358", employeeName: "Md Heron Mia", empCode: "EMP-3358",
        date: "02 Nov 2026", isoDate: "2026-11-02", leave: "-", punchIn: "10:52 AM",
        inLocation: "103.92.219.46", inCoordinates: "23.81233, 90.42218", punchOut: "—",
        outLocation: "—", outCoordinates: "", behavior: "early", breakTimes: "0:00:00", totalHours: "0:00:00",
        workShift: "Showroom", status: "Approved"
    },
    {
        id: "att-103", employeeId: "3360", employeeName: "Jannat Uli Naeem Sarah", empCode: "EMP-3360",
        date: "02 Nov 2026", isoDate: "2026-11-02", leave: "-", punchIn: "10:09 AM",
        inLocation: "103.231.161.177", inCoordinates: "23.81300, 90.42100", punchOut: "—",
        outLocation: "—", outCoordinates: "", behavior: "regular", breakTimes: "0:00:00", totalHours: "0:00:00",
        workShift: "Head Office", status: "Approved"
    },
    {
        id: "att-104", employeeId: "3363", employeeName: "MD. IRTIJA ARAFAT PRANTOR", empCode: "EMP-3363",
        date: "02 Nov 2026", isoDate: "2026-11-02", leave: "-", punchIn: "11:03 AM",
        inLocation: "103.92.219.46", inCoordinates: "23.81233, 90.42218", punchOut: "—",
        outLocation: "—", outCoordinates: "", behavior: "regular", breakTimes: "0:00:00", totalHours: "0:00:00",
        workShift: "Showroom", status: "Approved"
    },
    {
        id: "att-105", employeeId: "3369", employeeName: "Md Ahsan Habib Anik", empCode: "EMP-3369",
        date: "02 Nov 2026", isoDate: "2026-11-02", leave: "-", punchIn: "10:12 AM",
        inLocation: "37.111.212.11", inCoordinates: "23.81133, 90.42018", punchOut: "—",
        outLocation: "—", outCoordinates: "", behavior: "early", breakTimes: "0:00:00", totalHours: "0:00:00",
        workShift: "Showroom", status: "Approved"
    },
    {
        id: "att-106", employeeId: "3346", employeeName: "Mainul Hasan Mahin", empCode: "EMP-3346",
        date: "01 Nov 2026", isoDate: "2026-11-01", leave: "-", punchIn: "09:58 AM",
        inLocation: "37.111.211.217", inCoordinates: "23.81133, 90.42018", punchOut: "08:06 PM",
        outLocation: "37.111.211.235", outCoordinates: "23.81133, 90.42018", behavior: "early", breakTimes: "0:00:00", totalHours: "10:08:38",
        workShift: "Showroom", status: "Approved"
    }
];

export const MOCK_BREAK_TIMES: BreakTimeConfig[] = [
    { id: "bt-1", name: "Lunch Break", durationHours: 1, durationMinutes: 0 }
];
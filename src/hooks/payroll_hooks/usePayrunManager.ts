"use client";
import { useState } from "react";
import { useGlobalPayrollStore } from "@/store/useGlobalPayrollStore";
import { PayrunItem, PayslipItem } from "@/types/payroll.types";
import { toast } from "sonner";

export function usePayrunManager() {
    const store = useGlobalPayrollStore();

    const [view, setView] = useState<"list" | "wizard">("list");
    const [wizardStep, setWizardStep] = useState(1);

    // Wizard State
    const [targetDepartments, setTargetDepartments] = useState<string[]>([]);
    const [targetMonth, setTargetMonth] = useState("November");
    const [targetYear, setTargetYear] = useState("2026");
    const [includeOvertime, setIncludeOvertime] = useState(true);
    const [payrunNote, setPayrunNote] = useState("");
    const [draftPayslips, setDraftPayslips] = useState<PayslipItem[]>([]);

    const generateDrafts = () => {
        // In production, this pulls from useGlobalAttendanceStore. Mocked base logic:
        const generated: PayslipItem[] = [
            {
                id: `ps-draft-1`, payrunId: "temp", employeeId: "emp-1", employeeName: "MD. IRTIJA ARAFAT",
                basicSalary: 30000, netSalary: 32900, status: "Draft",
                allowances: [{ name: "KPI", amount: 3000 }],
                deductions: [{ name: "Late Fee", amount: 100 }],
                sentAt: null
            },
            {
                id: `ps-draft-2`, payrunId: "temp", employeeId: "emp-2", employeeName: "Jannat Ull Naeem",
                basicSalary: 45000, netSalary: 40500, status: "Draft",
                allowances: [],
                deductions: [{ name: "Unpaid Leave (LOP)", amount: 1500 }, { name: "Provident Fund", amount: 3000 }],
                sentAt: null
            }
        ];
        setDraftPayslips(generated);
        setWizardStep(4);
    };

    const finalizePayrun = () => {
        const payrunId = `pr-${Date.now()}`;
        const newPayrun: PayrunItem = {
            id: payrunId,
            title: `Payroll - ${targetMonth} ${targetYear}`,
            period: `${targetMonth} ${targetYear}`,
            targetMonth, targetYear,
            status: "Completed",
            totalPayslips: draftPayslips.length,
            generatedOn: new Date().toLocaleDateString("en-GB")
        };

        const finalizedPayslips = draftPayslips.map(ps => ({ ...ps, payrunId, id: `ps-${Math.random().toString(36).substr(2, 9)}` }));

        // Push to global store
        useGlobalPayrollStore.setState(prev => ({
            payruns: [newPayrun, ...prev.payruns],
            payslips: [...finalizedPayslips, ...prev.payslips]
        }));

        toast.success(`Payrun finalized! Generated ${finalizedPayslips.length} payslips.`);
        setView("list");
        setWizardStep(1);
    };

    return {
        view, setView, wizardStep, setWizardStep,
        targetDepartments, setTargetDepartments,
        targetMonth, setTargetMonth, targetYear, setTargetYear,
        includeOvertime, setIncludeOvertime,
        payrunNote, setPayrunNote,
        draftPayslips, generateDrafts, finalizePayrun,
        payruns: store.payruns
    };
}
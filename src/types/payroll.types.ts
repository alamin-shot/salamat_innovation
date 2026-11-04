export type BeneficiaryType = "Allowance" | "Deduction" | "Statutory";
export type BeneficiaryStatus = "Active" | "Inactive";
export type ComputationBase = "Fixed Amount" | "Percent of Basic" | "Percent of Gross";

export interface BeneficiaryItem {
    id: string;
    name: string;
    type: BeneficiaryType;
    status: BeneficiaryStatus;
    description: string;
}

export interface BadgeValueItem {
    id: string;
    beneficiaryId: string;
    amount: number;
    computationBase: ComputationBase;
}

// --- FULLY EXPANDED PAYRUN & PAYSLIP TYPES ---

export interface PayrunItem {
    id: string;
    title: string;
    period: string;
    targetMonth: string;
    targetYear: string;
    status: "Processing" | "Completed";
    totalPayslips: number;
    generatedOn: string;
}

export interface PayslipLineItem {
    name: string;
    amount: number;
}

export interface PayslipItem {
    id: string;
    payrunId: string;
    employeeId: string;
    employeeName: string;
    basicSalary: number;
    netSalary: number;
    status: "Draft" | "Paid";
    allowances: PayslipLineItem[];
    deductions: PayslipLineItem[];
    sentAt: string | null;
}
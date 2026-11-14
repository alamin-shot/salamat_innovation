import { DirectorError } from "@/types/directors";

export const DIRECTORS_LIST_PATH = "/admin/directors/directors";
export const directorProfilePath = (id: string) => `/admin/directors/director-profile/${id}`;

export const DIRECTOR_ERRORS: Readonly<Record<DirectorError, string>> = {
    name_required: "Full name is required.",
    title_required: "Title is required.",
    email_required: "Email is required.",
    phone_invalid: "Enter a valid Bangladeshi mobile number (01XXXXXXXXX or +8801XXXXXXXXX).",
    password_required: "Password is required.",
};

/** Labels and links of the Deposit / Withdrawals director pages (one shared Directors list behind both). */
export const DIRECTOR_SECTIONS = {
    deposit: {
        title: "Deposit",
        record: "Deposit",
        records: "Deposits",
        chooseHref: "/admin/deposit/choose-director",
        addHref: "/admin/deposit/add-deposit",
    },
    withdrawal: {
        title: "Withdrawal",
        record: "Withdrawal",
        records: "Withdrawals",
        chooseHref: "/admin/withdrawals/choose-director",
        addHref: "/admin/withdrawals/add-withdrawal",
    },
} as const;

// LAYER 1: Directors (future /api/directors). The only director list: Deposits and Withdrawals
// choose from it, and the Directors pages create and edit it.

export interface DirectorProfile {
    id: string;
    fullName: string;
    title: string;
    email: string;
    /** Normalised "01XXXXXXXXX". */
    phone: string;
    /**
     * Login password captured by Create Directors. Held only until the auth backend exists, which must
     * store a hash instead; it is never shown again after saving.
     */
    password: string;
    /** Profile photo (scaled data URL until media storage exists). */
    avatarUrl?: string;
    /** ISO-8601 */
    createdAt: string;
}

export interface NewDirectorInput {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    password: string;
    avatarUrl?: string;
}

/** Edit: password is optional — empty keeps the current one. */
export type DirectorUpdateInput = Omit<NewDirectorInput, "password"> & { password?: string };

export type DirectorError = "name_required" | "title_required" | "email_required" | "phone_invalid" | "password_required";

export type DirectorSaveResult = { ok: true; director: DirectorProfile } | { ok: false; error: DirectorError };

export interface DirectorsState {
    directors: DirectorProfile[];
    addDirector: (input: NewDirectorInput) => DirectorSaveResult;
    updateDirector: (id: string, input: DirectorUpdateInput) => DirectorSaveResult;
    deleteDirector: (id: string) => void;
}

/** A director with totals computed from Deposit / Withdrawal records. */
export interface DirectorSummary extends DirectorProfile {
    totalDeposit: number;
    totalWithdraw: number;
    /** deposit − withdrawal */
    totalBalance: number;
    withdrawalCount: number;
}

/** Which money section a director page belongs to (Deposit or Withdrawals). */
export type DirectorSectionKind = "deposit" | "withdrawal";

/** Section "Director" page row: a director with that section's activity. */
export interface DirectorSectionRow extends DirectorProfile {
    recordCount: number;
    totalAmount: number;
    /** YYYY-MM-DD of the latest record, or null. */
    lastDate: string | null;
}

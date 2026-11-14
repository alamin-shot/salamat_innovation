import { DirectorProfile } from "@/types/directors";

/** The two directors both old lists held (same ids, so existing deposits / withdrawals stay linked). */
export const INITIAL_DIRECTORS: DirectorProfile[] = [
    { id: "2", fullName: "Atick Hasan Sajib", title: "Managing Director", email: "atickhasansajib@gmail.com", phone: "01897715221", password: "password123", createdAt: "2026-01-01T10:00:00+06:00" },
    { id: "1", fullName: "Mohammadun Nabi", title: "Chairman", email: "nabi@gmail.com", phone: "01711000000", password: "password123", createdAt: "2026-01-01T10:00:00+06:00" },
];

import { Vlog } from "@/types/vlogs";

// Sample vlogs so the new spoke is not empty on first load. Replace with real content.
export const INITIAL_VLOGS: Vlog[] = [
    {
        id: "vlog-2",
        title: "TEKZO Grand Opening — Store Walkthrough",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnail: null,
        description: "A quick tour of the new TEKZO outlet: phones, accessories and the service desk.",
        status: "Active",
        publishDate: "2026-10-18",
        createdAt: "2026-10-18T12:00:00+06:00",
        createdBy: "Admin",
    },
    {
        id: "vlog-1",
        title: "VOLTME 3rd Anniversary Highlights",
        videoUrl: "https://vimeo.com/76979871",
        thumbnail: null,
        description: "Highlights from the VOLTME three-year celebration event.",
        status: "Inactive",
        publishDate: "2026-09-30",
        createdAt: "2026-09-30T16:30:00+06:00",
        createdBy: "Admin",
    },
];

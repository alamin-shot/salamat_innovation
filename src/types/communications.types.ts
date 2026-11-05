export type PublishStatus = "Draft" | "Scheduled" | "Live" | "Archived";
export type PriorityLevel = "Low" | "Medium" | "High";
export type RecurrenceRule = "None" | "Yearly";

export interface CommsAttachment {
    id: string;
    name: string;
    size: number;
    type: string;
    base64Data: string; // Safely handled by IndexedDB
}

export interface Holiday {
    id: string;
    name: string;
    startDate: string; // ISO yyyy-mm-dd to avoid timezone shifts
    endDate: string;
    departments: string[];
    description: string;
    recurrence: RecurrenceRule;
    _version: number;
}

export interface Event {
    id: string;
    eventType: string;
    title: string;
    startDateTime: string; // ISO UTC
    endDateTime: string;
    location: string;
    description: string; // Rich Text (Sanitized before render)
    status: PublishStatus;
    capacityLimit: number;
    rsvps: string[]; // Array of Emp IDs
    _version: number;
}

export interface Announcement {
    id: string;
    title: string;
    publishDate: string;
    expiryDate: string;
    departments: string[];
    description: string;
    priority: PriorityLevel;
    status: PublishStatus;
    acknowledgmentRequired: boolean;
    acknowledgedBy: string[]; // Array of Emp IDs
    attachments: CommsAttachment[];
    _version: number;
}
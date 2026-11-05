import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { get, set, del } from "idb-keyval";
import { Holiday, Event, Announcement } from "@/types/communications.types";

const idbStorage: StateStorage = {
    getItem: async (name: string): Promise<string | null> => (await get(name)) || null,
    setItem: async (name: string, value: string): Promise<void> => await set(name, value),
    removeItem: async (name: string): Promise<void> => await del(name),
};

interface CommsStore {
    holidays: Holiday[];
    events: Event[];
    announcements: Announcement[];

    addHoliday: (holiday: Omit<Holiday, "id" | "_version">) => void;
    addEvent: (event: Omit<Event, "id" | "_version">) => void;
    addAnnouncement: (announcement: Omit<Announcement, "id" | "_version">) => void;
}

export const useGlobalCommsStore = create<CommsStore>()(
    persist(
        (set) => ({
            holidays: [],
            events: [],
            announcements: [],

            addHoliday: (holiday) => set((state) => ({
                holidays: [...state.holidays, { ...holiday, id: crypto.randomUUID(), _version: 1 }]
            })),

            addEvent: (event) => set((state) => ({
                events: [...state.events, { ...event, id: crypto.randomUUID(), _version: 1 }]
            })),

            addAnnouncement: (announcement) => set((state) => ({
                announcements: [...state.announcements, { ...announcement, id: crypto.randomUUID(), _version: 1 }]
            })),
        }),
        {
            name: "erp-comms-engine-v1",
            storage: createJSONStorage(() => idbStorage),
            version: 1,
        }
    )
);
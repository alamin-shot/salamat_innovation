import { create } from "zustand";
import { persist } from "zustand/middleware";

// --- TYPES & INTERFACES ---
export interface UserRecord {
    id: string;
    name: string;
    email: string;
    phone: string;
    shop: string;
    role: string;
    status: "Active" | "Inactive";
}

export interface RoleRecord {
    id: string;
    name: string;
    userCount: number;
    permissions: string[]; // Array of granted permission IDs
}

export interface PermissionAction {
    id: string;
    label: string;
    requires?: string[]; // E.g., "edit_product" requires ["view_product"]
}

export interface PermissionModule {
    id: string;
    category: string;
    label: string;
    actions: PermissionAction[];
}

interface GlobalUserState {
    users: UserRecord[];
    roles: RoleRecord[];
    permissionMatrix: PermissionModule[];

    // Actions
    addUser: (user: Omit<UserRecord, "id">) => void;
    updateUser: (id: string, updates: Partial<UserRecord>) => void;
    deleteUsers: (ids: string[]) => void;

    addRole: (role: Omit<RoleRecord, "id" | "userCount">) => void;
    updateRole: (id: string, updates: Partial<RoleRecord>) => void;
    deleteRoles: (ids: string[]) => void;
}

// --- HIERARCHICAL PERMISSION SCHEMA ---
const MASTER_PERMISSION_MATRIX: PermissionModule[] = [
    {
        id: "mod_dashboard", category: "Dashboard", label: "Dashboards",
        actions: [
            { id: "view_dashboard_stats", label: "View dashboard statistics" },
            { id: "view_dashboard_sales", label: "View dashboard purchases and sales overview" },
            { id: "view_dashboard_products", label: "View dashboard top sell products" }
        ]
    },
    {
        id: "mod_products", category: "Products", label: "Products",
        actions: [
            { id: "view_products", label: "View Products" },
            { id: "create_products", label: "Create Products", requires: ["view_products"] },
            { id: "edit_products", label: "Edit Products", requires: ["view_products"] },
            { id: "delete_products", label: "Delete Products", requires: ["view_products"] }
        ]
    },
    {
        id: "mod_purchases", category: "Purchases", label: "Purchases",
        actions: [
            { id: "view_purchases", label: "View Purchases" },
            { id: "create_purchases", label: "Create Purchases", requires: ["view_purchases"] }
        ]
    }
    // In production, expand this matrix to cover all 548 permissions.
];

export const useGlobalUserStore = create<GlobalUserState>()(
    persist(
        (set) => ({
            permissionMatrix: MASTER_PERMISSION_MATRIX,
            users: [
                { id: "U-001", name: "Admin", email: "admin@salamatinnovation.com", phone: "01700000000", shop: "All", role: "Administrator", status: "Active" },
                { id: "U-002", name: "Alamin Rifat", email: "alamin@tekzo.com", phone: "01711111111", shop: "Jamuna Future Park", role: "Creative Head", status: "Active" }
            ],
            roles: [
                { id: "R-001", name: "Administrator", userCount: 1, permissions: ["view_dashboard_stats", "view_dashboard_sales", "view_products", "create_products", "edit_products", "delete_products"] },
                { id: "R-002", name: "Online marketing (ads)", userCount: 3, permissions: ["view_dashboard_stats"] },
                { id: "R-003", name: "Procurement Executive", userCount: 3, permissions: ["view_purchases", "create_purchases", "view_products"] },
                { id: "R-004", name: "Creative Head", userCount: 2, permissions: ["view_dashboard_stats", "view_products"] }
            ],

            addUser: (user) => set((state) => ({ users: [{ ...user, id: `U-${Date.now()}` }, ...state.users] })),
            updateUser: (id, updates) => set((state) => ({ users: state.users.map(u => u.id === id ? { ...u, ...updates } : u) })),
            deleteUsers: (ids) => set((state) => ({ users: state.users.filter(u => !ids.includes(u.id)), selectedIds: [] })),

            addRole: (role) => set((state) => ({ roles: [{ ...role, id: `R-${Date.now()}`, userCount: 0 }, ...state.roles] })),
            updateRole: (id, updates) => set((state) => ({ roles: state.roles.map(r => r.id === id ? { ...r, ...updates } : r) })),
            deleteRoles: (ids) => set((state) => ({ roles: state.roles.filter(r => !ids.includes(r.id)) }))
        }),
        {
            name: "erp-user-roles-storage-v1", // New key to force cache override
            partialize: (state) => ({ users: state.users, roles: state.roles }) // Don't persist the static matrix
        }
    )
);
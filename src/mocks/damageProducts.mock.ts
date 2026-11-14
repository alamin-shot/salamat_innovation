import { DamageProduct } from "@/types/damageProducts";

// Moved from useDamageProductsManager / ViewDamageProductDrawer / useAddDamageProductManager.
const SAZZAD = "Md Zihadul Islam Sazzad";

export const INITIAL_DAMAGE_PRODUCTS: DamageProduct[] = [
    {
        id: "2", ref: "DMG-000002", shop: "A-Block", date: "2026-10-13",
        createdAt: "2026-10-13T13:11:00+06:00", createdBy: SAZZAD, approvedBy: null, note: "", status: "Draft",
        serials: [
            { id: "dmg2-1", serialNo: "4516192621", product: "QCY Type C-L 27W Charging Cable", sku: "SI-588128987", variant: "Black", stockStatus: "Available" },
            { id: "dmg2-2", serialNo: "7627187010", product: "QCY Type C-L 27W Charging Cable", sku: "SI-588128987", variant: "Black", stockStatus: "Available" },
        ],
    },
    {
        id: "1", ref: "DMG-000001", shop: "A-Block", date: "2026-09-28",
        createdAt: "2026-09-28T17:53:00+06:00", createdBy: SAZZAD, approvedBy: null, note: "", status: "Draft",
        serials: [
            { id: "dmg1-1", serialNo: "SF165195KGSD0462AG", product: "Apple 20W USB C 3 Pin Power Adapter", sku: "SI-588130112", variant: "White", stockStatus: "Available" },
        ],
    },
];

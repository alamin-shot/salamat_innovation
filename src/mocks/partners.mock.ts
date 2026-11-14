import { Partner, PartnerStatus, PartnerTier, PartnerType } from "@/types/partners";

const seed = (id: string, type: PartnerType, tier: PartnerTier, name: string, businessName: string, primaryPhone: string, email: string, address: string, status: PartnerStatus, createdAt: string): Partner => ({
    id, type, tier, name, businessName, primaryPhone, email, address, status, createdAt,
    secondaryPhone: "-",
    tradeLicense: "-",
    logoUrl: null,
    history: [{ at: createdAt, event: type === "application" ? "Application received" : "Partner added" }],
});

/** Sample partners so every partner page has something to show. */
export const INITIAL_PARTNERS: Partner[] = [
    seed("pt-1", "dealer", "Platinum", "Kamrul Hasan", "KH Mobile Distribution", "01711223301", "kh.distribution@example.com", "Bashundhara City, Dhaka", "Active", "2026-03-12T10:00:00+06:00"),
    seed("pt-2", "dealer", "Gold", "Shafiq Rahman", "Rahman Telecom", "01711223302", "rahman.telecom@example.com", "Agrabad, Chattogram", "Active", "2026-06-02T10:00:00+06:00"),
    seed("pt-3", "dealer", "Standard", "Tanvir Alam", "Alam Gadget Point", "01711223303", "-", "Zindabazar, Sylhet", "Inactive", "2026-11-03T10:00:00+06:00"),
    seed("pt-4", "retailer", "Silver", "Nusrat Jahan", "Gadget Corner", "01711223304", "gadgetcorner@example.com", "Mirpur 10, Dhaka", "Active", "2026-08-21T10:00:00+06:00"),
    seed("pt-5", "retailer", "Standard", "Arif Hossain", "Phone Hub BD", "01711223305", "-", "Khulna Sadar, Khulna", "Active", "2026-11-08T10:00:00+06:00"),
    seed("pt-6", "b2b", "Gold", "Farhana Akter", "Nexa Corporate Solutions", "01711223306", "procurement@nexa.example.com", "Gulshan 2, Dhaka", "Active", "2026-05-15T10:00:00+06:00"),
    seed("pt-7", "b2b", "Standard", "Mehedi Hasan", "BrightEdu Ltd.", "01711223307", "it@brightedu.example.com", "Uttara, Dhaka", "Inactive", "2026-09-30T10:00:00+06:00"),
    seed("pt-8", "franchise", "Platinum", "Sabbir Ahmed", "TEKZO Rajshahi", "01711223308", "rajshahi@tekzo.example.com", "Shaheb Bazar, Rajshahi", "Active", "2026-02-01T10:00:00+06:00"),
    seed("pt-9", "application", "Standard", "Imran Kabir", "Kabir Electronics", "01711223309", "kabir.electronics@example.com", "Cumilla Sadar, Cumilla", "Pending", "2026-11-10T10:00:00+06:00"),
    seed("pt-10", "application", "Standard", "Rumana Sultana", "Sultana Smart Shop", "01711223310", "-", "Mymensingh Sadar, Mymensingh", "Pending", "2026-11-12T10:00:00+06:00"),
];

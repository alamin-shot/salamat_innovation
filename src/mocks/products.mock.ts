import {
    AuditStamp,
    Brand,
    Category,
    PriceRange,
    Product,
    ProductAttribute,
    ProductPage,
    ProductVariant,
    ProductVariantOption,
    ProductWarrantyDetails,
    SpecGroup,
    UsedProduct,
    WarrantyCareText,
} from "@/types/products";

// Seed data moved out of the Products table/form components.
// Business values are copied unchanged from the previous inline MOCK_* arrays;
// only the audit columns (createdBy / createdAt where it was missing), the new
// status flags and the Selling Price are added.

const audit = (createdAt: string, createdBy: string): AuditStamp => ({
    createdAt,
    createdBy,
    updatedAt: null,
    updatedBy: null,
});

// ── Warranty Care Text library ──────────────────────────────────────────────
// Seeded with the single warranty text the product screens showed before.
export const INITIAL_WARRANTY_CARE_TEXTS: WarrantyCareText[] = [
    { id: "wct-1", text: "1 Year Official Brand Warranty", status: "Active", ...audit("05-10-2026", "Admin") },
];

// ── Price ranges (storefront price filter chips) ────────────────────────────
// Mock bands; productCount is mocked until the backend supplies live counts.
// The Active bands touch edge to edge, so the seed has no overlaps or gaps.
export const INITIAL_PRICE_RANGES: PriceRange[] = [
    { id: "pr-1", label: "Budget Friendly", minPrice: 0, maxPrice: 15000, status: "Active", productCount: 12, ...audit("01-11-2026", "Admin") },
    { id: "pr-2", label: "Mid Range", minPrice: 15000, maxPrice: 40000, status: "Active", productCount: 18, ...audit("01-11-2026", "Admin") },
    { id: "pr-3", label: "Upper Mid Range", minPrice: 40000, maxPrice: 80000, status: "Active", productCount: 9, ...audit("02-11-2026", "Alamin Rifat") },
    { id: "pr-4", label: "Premium Elite", minPrice: 80000, maxPrice: null, status: "Active", productCount: 6, ...audit("02-11-2026", "Admin") },
    { id: "pr-5", label: "Flagship Deals", minPrice: 120000, maxPrice: 200000, status: "Inactive", productCount: 3, ...audit("05-11-2026", "Alamin Rifat") },
];

// ── Products ────────────────────────────────────────────────────────────────
// Same values the Warranty Details view displayed for every product.
const defaultWarranty = (): ProductWarrantyDetails => ({
    purchasePoint: "Official Store",
    warrantyDays: 365,
    warrantyCareTextId: "wct-1",
    serviceWarranty: "1 Year Free Servicing (Parts excluded)",
});

// Same starting rows the Variants builder displayed for every product.
const defaultVariantOptions = (): ProductVariantOption[] => [
    { id: "opt-1", name: "Storage", values: ["128GB"], valueImages: {} },
];

const defaultVariants = (): ProductVariant[] => [
    { id: "var-1", title: "128GB", sku: "", maxRetailPrice: null, sellingPrice: null, inStock: false, isPrebook: false },
];

const productDefaults = () => ({
    image: null,
    headline: "",
    keyFeatures: "",
    carePlanId: null,
    warranty: defaultWarranty(),
    bookingMoneyEnabled: true,
    bookingMoney: null,
    videos: [],
    variantOptions: defaultVariantOptions(),
    variants: defaultVariants(),
});

export const INITIAL_PRODUCTS: Product[] = [
    { id: "1", name: "vivo S2", category: "Smart Phones", brand: "VIVO", status: "Active", ecommerce: false, warrantyActive: true, tags: ["featured", "official"], variantsCount: 4, specsCount: 12, hasCare: true, ...productDefaults(), ...audit("05-10-2026", "Admin") },
    { id: "2", name: "vivo S50 Pro mini", category: "Smart Phones", brand: "VIVO", status: "Active", ecommerce: true, warrantyActive: true, tags: [], variantsCount: 2, specsCount: 8, hasCare: false, ...productDefaults(), ...audit("05-10-2026", "Alamin Rifat") },
    { id: "3", name: "Portable Mini Air Cooler", category: "Desk Fan", brand: "Non Brand", status: "Inactive", ecommerce: false, warrantyActive: false, tags: [], variantsCount: 0, specsCount: 4, hasCare: true, ...productDefaults(), ...audit("04-10-2026", "Admin") },
    { id: "4", name: "xiaomi 14", category: "Smart Phones", brand: "Xiaomi", status: "Active", ecommerce: true, warrantyActive: true, tags: [], variantsCount: 3, specsCount: 15, hasCare: true, ...productDefaults(), ...audit("05-10-2026", "Alamin Rifat") },
];

// ── Used products ───────────────────────────────────────────────────────────
// The previous single `price` (with a 0.00 discount) is carried into both
// MRP and Selling Price, so the derived discount starts at zero.
export const INITIAL_USED_PRODUCTS: UsedProduct[] = [
    { id: "1", name: "iPhone 13 Pro", image: "/phone.png", variant: "128GB/Gold", maxRetailPrice: 53990.0, sellingPrice: 53990.0, serialNumber: "359052378710667", carePlan: "TEKZO Care for Apple", boxAvailable: false, isSold: false, status: "Active", ecommerce: true, ...audit("05-10-2026", "Admin") },
    { id: "2", name: "iPhone 13 Pro", image: "/phone.png", variant: "256GB/Gold", maxRetailPrice: 56990.0, sellingPrice: 56990.0, serialNumber: "355677815053877", carePlan: "TEKZO Screen Care", boxAvailable: false, isSold: false, status: "Active", ecommerce: true, ...audit("05-10-2026", "Alamin Rifat") },
    { id: "3", name: "iPhone 13 Pro", image: "/phone.png", variant: "128GB/Sierra Blue", maxRetailPrice: 53990.0, sellingPrice: 53990.0, serialNumber: "353100552915705", carePlan: "None", boxAvailable: false, isSold: true, status: "Active", ecommerce: true, ...audit("04-10-2026", "Admin") },
];

// ── Brands ──────────────────────────────────────────────────────────────────
const brandDefaults = () => ({
    androidAppLink: "",
    iosAppLink: "",
    secondaryLogo: null,
});

export const INITIAL_BRANDS: Brand[] = [
    // App links and secondary logo for Apple are the values the Update Brand form displayed.
    { id: "1", name: "Apple", logo: "/phone.png", totalProducts: 61, tagline: "Think Different", primaryLogo: "/phone.png", shopBanner: "/banner.png", infoBanner: "/banner.png", status: "Active", ecommerce: true, androidAppLink: "https://play.google.com/store/apps/details?id=com.apple", iosAppLink: "https://apps.apple.com/app/id123456", secondaryLogo: "/phone.png", ...audit("12-08-2026", "Admin") },
    { id: "2", name: "Google", logo: "/phone.png", totalProducts: 23, tagline: "Do the right thing", primaryLogo: "/phone.png", shopBanner: "/banner.png", infoBanner: "/banner.png", status: "Active", ecommerce: true, ...brandDefaults(), ...audit("12-08-2026", "Alamin Rifat") },
    { id: "3", name: "SAMSUNG", logo: "/phone.png", totalProducts: 72, tagline: "Inspire the World, Create the Future", primaryLogo: "/phone.png", shopBanner: "/banner.png", infoBanner: "/banner.png", status: "Active", ecommerce: true, ...brandDefaults(), ...audit("14-08-2026", "Admin") },
    { id: "4", name: "Xiaomi", logo: "/phone.png", totalProducts: 129, tagline: "Innovation for everyone", primaryLogo: "/phone.png", shopBanner: "/banner.png", infoBanner: "/banner.png", status: "Active", ecommerce: true, ...brandDefaults(), ...audit("14-08-2026", "Alamin Rifat") },
    { id: "5", name: "Nothing", logo: "/phone.png", totalProducts: 11, tagline: "Make Tech Fun Again", primaryLogo: "/phone.png", shopBanner: "/banner.png", infoBanner: "/banner.png", status: "Active", ecommerce: true, ...brandDefaults(), ...audit("20-08-2026", "Admin") },
];

// ── Categories ──────────────────────────────────────────────────────────────
export const INITIAL_CATEGORIES: Category[] = [
    { id: "1", name: "Smart Band", parentCategory: "Wearable Technology", totalProducts: 1, logo: null, secLogo: "/phone.png", banner: "/banner.png", infoBanner: "/banner.png", status: "Active", ecommerce: true, ...audit("02-09-2026", "Admin") },
    { id: "2", name: "Desk Lamp", parentCategory: "Lighting", totalProducts: 1, logo: null, secLogo: "/phone.png", banner: "/banner.png", infoBanner: "/banner.png", status: "Active", ecommerce: true, ...audit("02-09-2026", "Alamin Rifat") },
    { id: "3", name: "Gaming", parentCategory: "-", totalProducts: 7, logo: null, secLogo: "/phone.png", banner: "/banner.png", infoBanner: "/banner.png", status: "Active", ecommerce: true, ...audit("05-09-2026", "Admin") },
];

// ── Pages ───────────────────────────────────────────────────────────────────
export const INITIAL_PAGES: ProductPage[] = [
    { id: "1", title: "home", slug: "home", shop: "Salamat Innovation", avatar: "/phone.png", secondaryLogo: null, shopBanner: "/banner.png", infoBanner: "/banner.png", status: "Active", ecommerce: true, ...audit("18-07-2026", "Admin") },
    { id: "2", title: "All Brands", slug: "brands", shop: "Salamat Innovation", avatar: "/phone.png", secondaryLogo: null, shopBanner: "/banner.png", infoBanner: "/banner.png", status: "Active", ecommerce: true, ...audit("18-07-2026", "Admin") },
    { id: "3", title: "All Categories", slug: "categories", shop: "Salamat Innovation", avatar: "/phone.png", secondaryLogo: null, shopBanner: "/banner.png", infoBanner: "/banner.png", status: "Active", ecommerce: true, ...audit("18-07-2026", "Alamin Rifat") },
    { id: "4", title: "Shop", slug: "shop", shop: "Salamat Innovation", avatar: "/phone.png", secondaryLogo: null, shopBanner: "/banner.png", infoBanner: "/banner.png", status: "Active", ecommerce: true, ...audit("18-07-2026", "Admin") },
    { id: "5", title: "About Us", slug: "about-us", shop: "Salamat Innovation", avatar: "/phone.png", secondaryLogo: null, shopBanner: null, infoBanner: null, status: "Active", ecommerce: true, ...audit("19-07-2026", "Alamin Rifat") },
    { id: "6", title: "Contact Us", slug: "contact-us", shop: "Salamat Innovation", avatar: "/phone.png", secondaryLogo: null, shopBanner: "/banner.png", infoBanner: "/banner.png", status: "Active", ecommerce: true, ...audit("19-07-2026", "Admin") },
    { id: "7", title: "Partners", slug: "partners", shop: "Salamat Innovation", avatar: "/phone.png", secondaryLogo: null, shopBanner: null, infoBanner: null, status: "Active", ecommerce: true, ...audit("21-07-2026", "Admin") },
    { id: "8", title: "Career", slug: "career", shop: "Salamat Innovation", avatar: "/phone.png", secondaryLogo: null, shopBanner: "/banner.png", infoBanner: "/banner.png", status: "Active", ecommerce: true, ...audit("21-07-2026", "Alamin Rifat") },
    { id: "9", title: "News", slug: "news", shop: "Salamat Innovation", avatar: "/phone.png", secondaryLogo: null, shopBanner: null, infoBanner: null, status: "Active", ecommerce: true, ...audit("24-07-2026", "Admin") },
    { id: "10", title: "Dealer Registration", slug: "dealer-register", shop: "Salamat Innovation", avatar: "/phone.png", secondaryLogo: null, shopBanner: null, infoBanner: null, status: "Active", ecommerce: true, ...audit("24-07-2026", "Alamin Rifat") },
];

// ── Attributes ──────────────────────────────────────────────────────────────
const attribute = (id: string, name: string, labels: string[], createdAt: string, createdBy: string): ProductAttribute => ({
    id,
    name,
    values: labels.map((label, index) => ({ id: `attr-${id}-val-${index + 1}`, label, image: null })),
    ...audit(createdAt, createdBy),
});

export const INITIAL_ATTRIBUTES: ProductAttribute[] = [
    attribute("1", "Otecto K77", ["3/32GB"], "10-06-2026", "Admin"),
    attribute("2", "Plug", ["UK", "US"], "10-06-2026", "Admin"),
    attribute("3", "Material", ["Aluminum", "Titanium"], "11-06-2026", "Alamin Rifat"),
    attribute("4", "First Use", ["Active", "In-Active"], "11-06-2026", "Admin"),
    attribute("5", "Noise Cancellation", ["ANC", "ENC"], "15-06-2026", "Alamin Rifat"),
    attribute("6", "General Information", ["Washing Capacity"], "15-06-2026", "Admin"),
    attribute("7", "Physical Information", ["Weight"], "15-06-2026", "Admin"),
    attribute("8", "SIM", ["E-SIM + E-SIM", "E-SIM Global", "E-SIM JP/UAE", "E-SIM USA", "Nano-SIM + E-SIM", "Nano-SIM + Nano-SIM"], "22-06-2026", "Alamin Rifat"),
    attribute("9", "Ethernet", ["10 Gigabit Ethernet", "Gigabit Ethernet"], "22-06-2026", "Admin"),
];

// ── Specification groups ────────────────────────────────────────────────────
export const INITIAL_SPEC_GROUPS: SpecGroup[] = [
    { id: "1", name: "More", subGroups: ["Colors", "Models", "Expected Price", "International Price"], ...audit("27-07-2026", "Admin") },
    { id: "2", name: "Sound", subGroups: ["Loudspeaker", "3.5mm Jack", "Audio Features"], ...audit("27-07-2026", "Alamin Rifat") },
    { id: "3", name: "Platform", subGroups: ["Operating System", "Chipset", "CPU", "GPU"], ...audit("27-07-2026", "Admin") },
    { id: "4", name: "Body", subGroups: ["Dimensions", "Weight", "Build", "Protection"], ...audit("27-07-2026", "Admin") },
    { id: "5", name: "Launch", subGroups: ["Announced", "Release Date", "Status"], ...audit("27-07-2026", "Alamin Rifat") },
    { id: "6", name: "Basic Information", subGroups: ["Display", "Battery", "Connectivity", "Material", "SpecialFeatures", "Sensor", "Supported Apps/ Software", "Others", "Dimension", "Weight", "Warranty"], ...audit("27-07-2026", "Admin") },
    { id: "7", name: "General", subGroups: ["Fast Charge Protocols Supported", "Cable Included", "Protections", "Specification", "Blending Power", "Motor Speed", "Maximum Volume", "Blades", "Filtration System", "Particle CADR", "Formaldehyde CADR", "Filtration Efficiency", "Coverage Area", "Smart Control", "Voice Control", "Filter Life", "Calling"], ...audit("15-06-2026", "Alamin Rifat") },
];

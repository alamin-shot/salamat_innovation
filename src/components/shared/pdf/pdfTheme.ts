import { Font, StyleSheet } from "@react-pdf/renderer";

// Shared look for every generated PDF (vouchers, reports, statements). Hind Siliguri covers Latin and
// Bengali, including the taka sign (৳); the files live in /public/fonts (SIL Open Font License).

export const PDF_FONT = "HindSiliguri";

let registered = false;

/** Registers the fonts once per page load; must run in the browser (fonts load from this site). */
export function registerPdfFonts(origin: string) {
    if (registered) return;
    Font.register({
        family: PDF_FONT,
        fonts: [
            { src: `${origin}/fonts/HindSiliguri-Regular.ttf`, fontWeight: 400 },
            { src: `${origin}/fonts/HindSiliguri-SemiBold.ttf`, fontWeight: 600 },
            { src: `${origin}/fonts/HindSiliguri-Bold.ttf`, fontWeight: 700 },
        ],
    });
    // Never split words across lines (names, invoice numbers).
    Font.registerHyphenationCallback((word) => [word]);
    registered = true;
}

export const PDF_COLORS = {
    brand: "#059669",
    accent: "#f59e0b",
    text: "#111827",
    muted: "#6b7280",
    line: "#e5e7eb",
    panel: "#f9fafb",
};

export const pdfBase = StyleSheet.create({
    page: { fontFamily: PDF_FONT, fontSize: 10, color: PDF_COLORS.text, paddingTop: 36, paddingBottom: 56, paddingHorizontal: 40 },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", borderBottomWidth: 2, borderBottomColor: PDF_COLORS.accent, paddingBottom: 14, marginBottom: 18 },
    brandRow: { flexDirection: "row", alignItems: "center", gap: 10 },
    logo: { width: 56, height: 56 },
    brandSub: { fontSize: 9, color: PDF_COLORS.muted },
    docTitle: { fontSize: 16, fontWeight: 700, letterSpacing: 1.5, textAlign: "right" },
    metaLine: { fontSize: 9, color: PDF_COLORS.muted, textAlign: "right", marginTop: 2 },
    metaValue: { color: PDF_COLORS.text, fontWeight: 600 },
    footer: { position: "absolute", bottom: 24, left: 40, right: 40, flexDirection: "row", justifyContent: "space-between", fontSize: 8, color: PDF_COLORS.muted, borderTopWidth: 1, borderTopColor: PDF_COLORS.line, paddingTop: 6 },
});

/** "1,25,000.00" (Bangladeshi grouping). */
export const pdfMoney = (value: number) => value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

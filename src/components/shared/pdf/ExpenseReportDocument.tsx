import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { ExpenseItem } from "@/hooks/finance_hooks/expenses/useExpensesStore";
import { takaInWords } from "@/utils/amountInWords";
import { formatAbsolute, formatDay } from "@/utils/dateDisplay";
import { toIsoDate, toTimestamp } from "@/utils/dateRules";
import { PDF_COLORS, pdfBase, pdfMoney } from "./pdfTheme";

const COLS = { no: 22, date: 62, voucher: 62, title: 0, category: 110, method: 62, amount: 72 };

const s = StyleSheet.create({
    th: { flexDirection: "row", backgroundColor: PDF_COLORS.brand, color: "#ffffff", fontWeight: 600, fontSize: 8.5 },
    tr: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: PDF_COLORS.line, fontSize: 8.5 },
    trAlt: { backgroundColor: PDF_COLORS.panel },
    cell: { paddingVertical: 5, paddingHorizontal: 4 },
    right: { textAlign: "right" },
    summary: { flexDirection: "row", gap: 16, marginTop: 16 },
    box: { flex: 1, borderWidth: 1, borderColor: PDF_COLORS.line, borderRadius: 4, padding: 10 },
    boxTitle: { fontSize: 8, fontWeight: 600, color: PDF_COLORS.muted, marginBottom: 6 },
    line: { flexDirection: "row", justifyContent: "space-between", fontSize: 9, paddingVertical: 2 },
    grand: { flexDirection: "row", justifyContent: "space-between", marginTop: 6, paddingTop: 6, borderTopWidth: 1, borderTopColor: PDF_COLORS.text, fontSize: 12, fontWeight: 700 },
    words: { fontSize: 8.5, color: PDF_COLORS.muted, marginTop: 6 },
});

const w = (width: number) => (width ? { width } : { flex: 1 });

/** A list of expenses (the table's current filter / search, or a selection) with category subtotals. */
export function ExpenseReportDocument({ data, logoUrl, generatedAt }: { data: ExpenseItem[]; logoUrl: string; generatedAt: string }) {
    const rows = [...data].sort((a, b) => toTimestamp(toIsoDate(a.date)) - toTimestamp(toIsoDate(b.date)));
    const total = rows.reduce((sum, item) => sum + Math.round(item.amount * 100), 0) / 100;
    const byCategory = Array.from(rows.reduce((map, item) => map.set(item.category, (map.get(item.category) ?? 0) + Math.round(item.amount * 100)), new Map<string, number>()))
        .map(([category, paisa]) => ({ category, amount: paisa / 100 }))
        .sort((a, b) => b.amount - a.amount);
    const first = rows[0] ? formatDay(toIsoDate(rows[0].date)) : "-";
    const last = rows.length ? formatDay(toIsoDate(rows[rows.length - 1].date)) : "-";
    const shops = Array.from(new Set(rows.map((item) => item.shopName.replace(/^TEKZO\s+/i, "")))).join(", ") || "-";

    return (
        <Document title="Expense Report" author="TEKZO" subject="Expense Report">
            <Page size="A4" style={pdfBase.page}>
                <View style={pdfBase.header} fixed>
                    <View style={pdfBase.brandRow}>
                        {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt */}
                        <Image src={logoUrl} style={pdfBase.logo} />
                        <View>
                            <Text style={pdfBase.brandSub}>{shops}</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={pdfBase.docTitle}>EXPENSE REPORT</Text>
                        <Text style={pdfBase.metaLine}>Period: <Text style={pdfBase.metaValue}>{first} – {last}</Text></Text>
                        <Text style={pdfBase.metaLine}>Entries: <Text style={pdfBase.metaValue}>{rows.length}</Text></Text>
                    </View>
                </View>

                <View style={s.th} fixed>
                    <Text style={[s.cell, w(COLS.no)]}>#</Text>
                    <Text style={[s.cell, w(COLS.date)]}>Date</Text>
                    <Text style={[s.cell, w(COLS.voucher)]}>Voucher</Text>
                    <Text style={[s.cell, w(COLS.title)]}>Title</Text>
                    <Text style={[s.cell, w(COLS.category)]}>Category</Text>
                    <Text style={[s.cell, w(COLS.method)]}>Method</Text>
                    <Text style={[s.cell, w(COLS.amount), s.right]}>Amount (৳)</Text>
                </View>
                {rows.map((item, index) => (
                    <View key={item.id} style={index % 2 ? [s.tr, s.trAlt] : s.tr} wrap={false}>
                        <Text style={[s.cell, w(COLS.no)]}>{index + 1}</Text>
                        <Text style={[s.cell, w(COLS.date)]}>{formatDay(toIsoDate(item.date))}</Text>
                        <Text style={[s.cell, w(COLS.voucher)]}>{item.invoiceNumber}</Text>
                        <Text style={[s.cell, w(COLS.title)]}>{item.title}</Text>
                        <Text style={[s.cell, w(COLS.category)]}>{item.category}</Text>
                        <Text style={[s.cell, w(COLS.method)]}>{item.paymentMethod}</Text>
                        <Text style={[s.cell, w(COLS.amount), s.right]}>{pdfMoney(item.amount)}</Text>
                    </View>
                ))}

                <View style={s.summary} wrap={false}>
                    <View style={s.box}>
                        <Text style={s.boxTitle}>BY CATEGORY</Text>
                        {byCategory.map((entry) => (
                            <View key={entry.category} style={s.line}>
                                <Text>{entry.category}</Text>
                                <Text>৳ {pdfMoney(entry.amount)}</Text>
                            </View>
                        ))}
                    </View>
                    <View style={s.box}>
                        <Text style={s.boxTitle}>TOTAL</Text>
                        <View style={s.line}><Text>Entries</Text><Text>{rows.length}</Text></View>
                        <View style={s.grand}><Text>Grand Total</Text><Text>৳ {pdfMoney(total)}</Text></View>
                        <Text style={s.words}>{takaInWords(total)}</Text>
                    </View>
                </View>

                <View style={pdfBase.footer} fixed>
                    <Text>TEKZO · Expense Report · Generated {formatAbsolute(generatedAt)}</Text>
                    <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
                </View>
            </Page>
        </Document>
    );
}

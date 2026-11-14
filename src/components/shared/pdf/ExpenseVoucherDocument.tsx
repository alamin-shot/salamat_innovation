import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { ExpenseItem } from "@/hooks/finance_hooks/expenses/useExpensesStore";
import { takaInWords } from "@/utils/amountInWords";
import { formatAbsolute, formatDay } from "@/utils/dateDisplay";
import { toIsoDate } from "@/utils/dateRules";
import { PDF_COLORS, pdfBase, pdfMoney } from "./pdfTheme";

const s = StyleSheet.create({
    section: { borderWidth: 1, borderColor: PDF_COLORS.line, borderRadius: 4 },
    row: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: PDF_COLORS.line },
    rowLast: { flexDirection: "row" },
    label: { width: 120, padding: 8, backgroundColor: PDF_COLORS.panel, color: PDF_COLORS.muted, fontWeight: 600 },
    value: { flex: 1, padding: 8 },
    amountBand: { flexDirection: "row", marginTop: 16, borderWidth: 1, borderColor: PDF_COLORS.brand, borderRadius: 4 },
    amountWords: { flex: 1, padding: 10 },
    amountWordsLabel: { fontSize: 8, color: PDF_COLORS.muted, marginBottom: 2 },
    amountBox: { width: 160, padding: 10, backgroundColor: PDF_COLORS.brand, color: "#ffffff", alignItems: "flex-end", justifyContent: "center" },
    amountBoxLabel: { fontSize: 8, color: "#d1fae5" },
    amountBoxValue: { fontSize: 16, fontWeight: 700 },
    signatures: { flexDirection: "row", justifyContent: "space-between", marginTop: 70, paddingHorizontal: 20 },
    signature: { width: 150, borderTopWidth: 1, borderTopColor: PDF_COLORS.muted, paddingTop: 4, textAlign: "center", fontSize: 9, color: PDF_COLORS.muted },
});

const orDash = (value: string) => (value && value.trim() !== "" ? value : "-");

/** One expense as a printable voucher: header, particulars, amount in figures and words, signatures. */
export function ExpenseVoucherDocument({ record, logoUrl, generatedAt }: { record: ExpenseItem; logoUrl: string; generatedAt: string }) {
    const shop = record.shopName.replace(/^TEKZO\s+/i, "");
    const particulars: [string, string][] = [
        ["Title", record.title],
        ["Category", record.category],
        ["Shop", shop],
        ["Payment Method", record.paymentMethod],
        ["Note", orDash(record.note)],
        ["Attachments", String(record.attachments)],
        ["Created By", record.createdBy],
    ];

    return (
        <Document title={`Expense Voucher ${record.invoiceNumber}`} author="TEKZO" subject="Expense Voucher">
            <Page size="A4" style={pdfBase.page}>
                <View style={pdfBase.header}>
                    <View style={pdfBase.brandRow}>
                        {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt */}
                        <Image src={logoUrl} style={pdfBase.logo} />
                        <View>
                            <Text style={pdfBase.brandSub}>{shop}</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={pdfBase.docTitle}>EXPENSE VOUCHER</Text>
                        <Text style={pdfBase.metaLine}>Voucher No: <Text style={pdfBase.metaValue}>{record.invoiceNumber}</Text></Text>
                        <Text style={pdfBase.metaLine}>Date: <Text style={pdfBase.metaValue}>{formatDay(toIsoDate(record.date))}</Text></Text>
                    </View>
                </View>

                <View style={s.section}>
                    {particulars.map(([label, value], index) => (
                        <View key={label} style={index === particulars.length - 1 ? s.rowLast : s.row}>
                            <Text style={s.label}>{label}</Text>
                            <Text style={s.value}>{value}</Text>
                        </View>
                    ))}
                </View>

                <View style={s.amountBand}>
                    <View style={s.amountWords}>
                        <Text style={s.amountWordsLabel}>AMOUNT IN WORDS</Text>
                        <Text>{takaInWords(record.amount)}</Text>
                    </View>
                    <View style={s.amountBox}>
                        <Text style={s.amountBoxLabel}>TOTAL (BDT)</Text>
                        <Text style={s.amountBoxValue}>৳ {pdfMoney(record.amount)}</Text>
                    </View>
                </View>

                <View style={s.signatures}>
                    <Text style={s.signature}>Prepared By</Text>
                    <Text style={s.signature}>Approved By</Text>
                </View>

                <View style={pdfBase.footer} fixed>
                    <Text>TEKZO · Expense Voucher {record.invoiceNumber}</Text>
                    <Text>Generated {formatAbsolute(generatedAt)}</Text>
                </View>
            </Page>
        </Document>
    );
}

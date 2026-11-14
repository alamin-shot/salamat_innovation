import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { DirectorSummary } from "@/types/directors";
import { Deposit } from "@/hooks/finance_hooks/deposit_hooks/useDepositStore";
import { Withdrawal } from "@/hooks/finance_hooks/withdrawal_hooks/useWithdrawalStore";
import { formatAbsolute, formatDay } from "@/utils/dateDisplay";
import { toIsoDate, toTimestamp } from "@/utils/dateRules";
import { PDF_COLORS, pdfBase, pdfMoney } from "./pdfTheme";

const s = StyleSheet.create({
    profile: { flexDirection: "row", justifyContent: "space-between", marginBottom: 14 },
    name: { fontSize: 14, fontWeight: 700 },
    muted: { fontSize: 9, color: PDF_COLORS.muted, marginTop: 2 },
    cards: { flexDirection: "row", gap: 10, marginBottom: 18 },
    card: { flex: 1, borderWidth: 1, borderColor: PDF_COLORS.line, borderTopWidth: 3, borderRadius: 4, padding: 8 },
    cardLabel: { fontSize: 8, color: PDF_COLORS.muted },
    cardValue: { fontSize: 13, fontWeight: 700, marginTop: 2 },
    sectionTitle: { fontSize: 11, fontWeight: 700, marginTop: 6, marginBottom: 6 },
    th: { flexDirection: "row", backgroundColor: PDF_COLORS.brand, color: "#ffffff", fontWeight: 600, fontSize: 8.5 },
    tr: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: PDF_COLORS.line, fontSize: 8.5 },
    cell: { paddingVertical: 5, paddingHorizontal: 4 },
    date: { width: 70 },
    title: { flex: 1 },
    note: { width: 120 },
    amount: { width: 80, textAlign: "right" },
    totalRow: { flexDirection: "row", justifyContent: "flex-end", paddingVertical: 5, fontSize: 9, fontWeight: 700 },
    empty: { fontSize: 9, color: PDF_COLORS.muted, paddingVertical: 6 },
});

type Entry = Deposit | Withdrawal;

function EntryTable({ title, rows, total }: { title: string; rows: Entry[]; total: number }) {
    const sorted = [...rows].sort((a, b) => toTimestamp(toIsoDate(a.date)) - toTimestamp(toIsoDate(b.date)));
    return (
        <View>
            <Text style={s.sectionTitle}>{title} ({rows.length})</Text>
            <View style={s.th}>
                <Text style={[s.cell, s.date]}>Date</Text>
                <Text style={[s.cell, s.title]}>Title</Text>
                <Text style={[s.cell, s.note]}>Note</Text>
                <Text style={[s.cell, s.amount]}>Amount (৳)</Text>
            </View>
            {sorted.length === 0 && <Text style={s.empty}>No records.</Text>}
            {sorted.map((row) => (
                <View key={row.id} style={s.tr} wrap={false}>
                    <Text style={[s.cell, s.date]}>{formatDay(toIsoDate(row.date))}</Text>
                    <Text style={[s.cell, s.title]}>{row.title}</Text>
                    <Text style={[s.cell, s.note]}>{row.note}</Text>
                    <Text style={[s.cell, s.amount]}>{pdfMoney(row.amount)}</Text>
                </View>
            ))}
            <View style={s.totalRow}><Text>Total: ৳ {pdfMoney(total)}</Text></View>
        </View>
    );
}

/** A director's capital statement: deposits, withdrawals and the resulting balance. */
export function DirectorStatementDocument({ director, deposits, withdrawals, logoUrl, generatedAt }: {
    director: DirectorSummary; deposits: Deposit[]; withdrawals: Withdrawal[]; logoUrl: string; generatedAt: string;
}) {
    return (
        <Document title={`Director Statement ${director.fullName}`} author="TEKZO" subject="Director Statement">
            <Page size="A4" style={pdfBase.page}>
                <View style={pdfBase.header} fixed>
                    <View style={pdfBase.brandRow}>
                        {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt */}
                        <Image src={logoUrl} style={pdfBase.logo} />
                    </View>
                    <View>
                        <Text style={pdfBase.docTitle}>DIRECTOR STATEMENT</Text>
                        <Text style={pdfBase.metaLine}>As of: <Text style={pdfBase.metaValue}>{formatDay(generatedAt)}</Text></Text>
                    </View>
                </View>

                <View style={s.profile}>
                    <View>
                        <Text style={s.name}>{director.fullName}</Text>
                        <Text style={s.muted}>{director.title}</Text>
                    </View>
                    <View>
                        <Text style={s.muted}>Phone: {director.phone}</Text>
                        <Text style={s.muted}>Email: {director.email}</Text>
                    </View>
                </View>

                <View style={s.cards}>
                    <View style={[s.card, { borderTopColor: PDF_COLORS.brand }]}><Text style={s.cardLabel}>TOTAL DEPOSIT</Text><Text style={s.cardValue}>৳ {pdfMoney(director.totalDeposit)}</Text></View>
                    <View style={[s.card, { borderTopColor: PDF_COLORS.accent }]}><Text style={s.cardLabel}>TOTAL WITHDRAW</Text><Text style={s.cardValue}>৳ {pdfMoney(director.totalWithdraw)}</Text></View>
                    <View style={[s.card, { borderTopColor: PDF_COLORS.text }]}><Text style={s.cardLabel}>BALANCE (DEPOSIT − WITHDRAWAL)</Text><Text style={s.cardValue}>৳ {pdfMoney(director.totalBalance)}</Text></View>
                </View>

                <EntryTable title="Deposits" rows={deposits} total={director.totalDeposit} />
                <EntryTable title="Withdrawals" rows={withdrawals} total={director.totalWithdraw} />

                <View style={pdfBase.footer} fixed>
                    <Text>TEKZO · Director Statement · Generated {formatAbsolute(generatedAt)}</Text>
                    <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
                </View>
            </Page>
        </Document>
    );
}

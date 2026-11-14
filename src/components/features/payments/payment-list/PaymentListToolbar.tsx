import { SectionFilterBar } from "@/components/ui/SectionFilterBar";
import { ColumnsVisibilityDropdown } from "@/components/ui/ColumnsVisibilityDropdown";
import { PaymentListManagerType } from "@/hooks/finance_hooks/payments/usePaymentListManager";
import { PaymentDirection } from "@/types/payments";
import { PAYMENT_TYPE_OPTIONS } from "@/constants/payments";

const COLUMN_LABELS = [
    { key: "contact", label: "Contact" },
    { key: "businessName", label: "Business Name" },
    { key: "businessLogo", label: "Business Logo" },
    { key: "date", label: "Date" },
    { key: "invoiceNumber", label: "Payment / Invoice" },
    { key: "type", label: "Type" },
    { key: "debit", label: "Debit" },
    { key: "credit", label: "Credit" },
];

const toDirection = (value: string): PaymentDirection | "" => (value === "payment sent" || value === "payment received" ? value : "");

/** Search plus Type, Contact, Date and Amount filters; every filter lives in the manager hook. */
export function PaymentListToolbar({ manager }: { manager: PaymentListManagerType }) {
    const { table, filters } = manager;

    return (
        <div className="border-b border-brand-subtext/20 bg-white">
            <SectionFilterBar
                searchQuery={table.searchQuery}
                onSearchChange={table.setSearchQuery}
                searchPlaceholder="Search contact, payment no., invoice or method"
                filters={[
                    {
                        key: "type",
                        label: "Type",
                        options: PAYMENT_TYPE_OPTIONS,
                        value: filters.type,
                        onChange: (value) => manager.setFilter("type", toDirection(value)),
                    },
                    {
                        key: "party",
                        label: "Contact",
                        options: manager.partyOptions,
                        value: filters.party,
                        onChange: (value) => manager.setFilter("party", value),
                    },
                ]}
                dateFilter={{ label: "Date", value: filters.date, onChange: (value) => manager.setFilter("date", value) }}
                amountFilter={{ label: "Amount", value: filters.amount, onChange: (value) => manager.setFilter("amount", value) }}
                activeFilterCount={manager.activeFilterCount}
                onClearAll={manager.clearFilters}
                resultCount={table.filteredData.length}
                actions={
                    <ColumnsVisibilityDropdown
                        columns={COLUMN_LABELS}
                        visibleColumns={manager.cols}
                        onToggleColumn={manager.toggleColumn}
                        onReset={manager.showAllColumns}
                    />
                }
            />
        </div>
    );
}

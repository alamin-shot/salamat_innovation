import { SectionFilterBar } from "@/components/ui/SectionFilterBar";
import { ColumnsVisibilityDropdown } from "@/components/ui/ColumnsVisibilityDropdown";
import { AddPaymentManagerType } from "@/hooks/finance_hooks/payments/useAddPaymentManager";
import { PARTY_TYPE_OPTIONS } from "@/constants/payments";

const COLUMN_LABELS = [
    { key: "name", label: "Name" },
    { key: "businessName", label: "Business Name" },
    { key: "businessLogo", label: "Business Logo" },
    { key: "phoneNumber", label: "Phone Number" },
    { key: "debit", label: "Debit" },
    { key: "credit", label: "Credit" },
    { key: "balance", label: "Balance" },
];

export function AddPaymentToolbar({ manager }: { manager: AddPaymentManagerType }) {
    const { table } = manager;

    return (
        <div className="border-b border-brand-subtext/20 bg-white">
            <SectionFilterBar
                searchQuery={table.searchQuery}
                onSearchChange={table.setSearchQuery}
                searchPlaceholder="Search name, business or phone"
                filters={[{ key: "type", label: "Type", options: PARTY_TYPE_OPTIONS, value: manager.typeFilter, onChange: manager.setTypeFilter }]}
                activeFilterCount={manager.typeFilter ? 1 : 0}
                onClearAll={manager.clearFilters}
                resultCount={table.filteredData.length}
                actions={<ColumnsVisibilityDropdown columns={COLUMN_LABELS} visibleColumns={manager.cols} onToggleColumn={manager.toggleColumn} onReset={manager.showAllColumns} />}
            />
        </div>
    );
}

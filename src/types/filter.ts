export interface FilterOption {
    label: string;
    value: string;
}

export interface FilterGroup {
    id: string;
    label: string;
    options: FilterOption[];
}
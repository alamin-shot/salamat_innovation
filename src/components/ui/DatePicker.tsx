interface DatePickerProps {
    value: string;
    onChange: (val: string) => void;
    label?: string;
    required?: boolean;
}

export function DatePicker({ value, onChange, label, required }: DatePickerProps) {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label className="erp-label">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <input
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="erp-input text-gray-700 cursor-pointer"
            />
        </div>
    );
}
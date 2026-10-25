export const formatCurrency = (amount: number): string => {
    return `৳ ${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
};

export const formatDate = (dateString: string): string => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
    });
};

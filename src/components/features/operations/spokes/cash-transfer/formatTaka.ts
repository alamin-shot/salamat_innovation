/** "৳ 14,500.00" — en-IN grouping, as the Cash Transfer screens show. */
export const formatTaka = (amount: number): string =>
    `৳ ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

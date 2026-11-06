export type ColumnRenderType = "text" | "currency" | "badge" | "date" | "action";

export interface ReportColumnDef {
    id: string;
    label: string;
    renderType: ColumnRenderType;
    align?: "left" | "center" | "right";
    isAlwaysPrinted?: boolean;
}

export const getReportColumns = (reportType: string): ReportColumnDef[] => {
    switch (reportType) {
        case "stock": //[cite: 1]
            return [
                { id: "product", label: "Product", renderType: "text", isAlwaysPrinted: true },
                { id: "brand", label: "Brand", renderType: "text" },
                { id: "category", label: "Category", renderType: "text" },
                { id: "purchaseDate", label: "Purchase Date", renderType: "date" },
                { id: "supplier", label: "Supplier", renderType: "text" },
                { id: "invoiceNumber", label: "Invoice Number", renderType: "text", isAlwaysPrinted: true },
                { id: "serialNumber", label: "Serial Number", renderType: "text" },
                { id: "quantity", label: "Quantity", renderType: "text", align: "center" },
                { id: "sale", label: "Sale", renderType: "text", align: "center" },
                { id: "inStock", label: "In Stock", renderType: "text", align: "center", isAlwaysPrinted: true },
            ];
        case "profit_loss": //[cite: 2]
            return [
                { id: "date", label: "Date", renderType: "date", isAlwaysPrinted: true },
                { id: "invoiceNumber", label: "Invoice Number", renderType: "text", isAlwaysPrinted: true },
                { id: "product", label: "Product", renderType: "text" },
                { id: "seller", label: "Seller", renderType: "text" },
                { id: "paymentMethod", label: "Payment Method", renderType: "text" },
                { id: "status", label: "Status", renderType: "badge", align: "center" },
                { id: "totalSale", label: "Total Sale", renderType: "currency", align: "right", isAlwaysPrinted: true },
                { id: "totalPurchase", label: "Total Purchase", renderType: "currency", align: "right", isAlwaysPrinted: true },
                { id: "profitLoss", label: "Profit Loss", renderType: "currency", align: "right", isAlwaysPrinted: true },
            ];
        case "sale": //[cite: 3]
        case "sale_return": //[cite: 5]
            return [
                { id: "customer", label: "Customer", renderType: "text", isAlwaysPrinted: true },
                { id: "date", label: "Date", renderType: "date", isAlwaysPrinted: true },
                { id: "paymentMethod", label: "Payment Method", renderType: "text" },
                { id: "invoiceNumber", label: "Invoice Number", renderType: "text", isAlwaysPrinted: true },
                { id: "totalItem", label: "Total Item", renderType: "text", align: "center" },
                { id: "totalAmount", label: "Total Amount", renderType: "currency", align: "right", isAlwaysPrinted: true },
                { id: "dueAmount", label: "Due Amount", renderType: "currency", align: "right", isAlwaysPrinted: true },
                { id: "receivedAmount", label: "Received Amount", renderType: "currency", align: "right" },
                { id: "seller", label: "Seller", renderType: "text" },
                { id: "status", label: "Status", renderType: "badge", align: "center", isAlwaysPrinted: true },
            ];
        case "purchase": //[cite: 6]
        case "purchase_return": //[cite: 7]
            return [
                { id: "supplier", label: "Supplier", renderType: "text", isAlwaysPrinted: true },
                { id: "date", label: "Date", renderType: "date", isAlwaysPrinted: true },
                { id: "paymentMethod", label: "Payment Method", renderType: "text" },
                { id: "invoiceNumber", label: "Invoice Number", renderType: "text", isAlwaysPrinted: true },
                { id: "totalItem", label: "Total Item", renderType: "text", align: "center" },
                { id: "totalAmount", label: "Total Amount", renderType: "currency", align: "right", isAlwaysPrinted: true },
                { id: "dueAmount", label: "Due Amount", renderType: "currency", align: "right", isAlwaysPrinted: true },
                { id: "receivedAmount", label: "Received Amount", renderType: "currency", align: "right" },
                { id: "status", label: "Status", renderType: "badge", align: "center", isAlwaysPrinted: true },
            ];
        case "stock_transfer": //[cite: 8]
            return [
                { id: "reference", label: "Ref #", renderType: "text", isAlwaysPrinted: true },
                { id: "date", label: "Date", renderType: "date", isAlwaysPrinted: true },
                { id: "fromWarehouse", label: "From Warehouse", renderType: "text" },
                { id: "toWarehouse", label: "To Warehouse", renderType: "text", isAlwaysPrinted: true },
                { id: "totalItem", label: "Total Item", renderType: "text", align: "center" },
                { id: "status", label: "Status", renderType: "badge", align: "center" },
                { id: "createdBy", label: "Created By", renderType: "text" },
            ];
        case "cash_transfer": //[cite: 9]
            return [
                { id: "reference", label: "Ref #", renderType: "text", isAlwaysPrinted: true },
                { id: "date", label: "Date", renderType: "date", isAlwaysPrinted: true },
                { id: "fromWarehouse", label: "From Warehouse", renderType: "text" },
                { id: "toWarehouse", label: "To Warehouse", renderType: "text", isAlwaysPrinted: true },
                { id: "amount", label: "Amount", renderType: "currency", align: "right", isAlwaysPrinted: true },
                { id: "status", label: "Status", renderType: "badge", align: "center" },
            ];
        case "damage": //[cite: 10]
            return [
                { id: "reference", label: "Ref #", renderType: "text", isAlwaysPrinted: true },
                { id: "date", label: "Date", renderType: "date", isAlwaysPrinted: true },
                { id: "warehouse", label: "Warehouse", renderType: "text" },
                { id: "totalItem", label: "Total Item", renderType: "text", align: "center" },
                { id: "status", label: "Status", renderType: "badge", align: "center" },
                { id: "approvedBy", label: "Approved By", renderType: "text" },
            ];
        case "deposit": //[cite: 11]
            return [
                { id: "date", label: "Date", renderType: "date", isAlwaysPrinted: true },
                { id: "invoiceNumber", label: "Invoice Number", renderType: "text", isAlwaysPrinted: true },
                { id: "title", label: "Title", renderType: "text" },
                { id: "category", label: "Category", renderType: "text" },
                { id: "party", label: "Party", renderType: "text" },
                { id: "director", label: "Director", renderType: "text" },
                { id: "depositAmount", label: "Deposit", renderType: "currency", align: "right", isAlwaysPrinted: true },
            ];
        case "withdrawal": //[cite: 12]
            return [
                { id: "date", label: "Date", renderType: "date", isAlwaysPrinted: true },
                { id: "invoiceNumber", label: "Invoice Number", renderType: "text", isAlwaysPrinted: true },
                { id: "title", label: "Title", renderType: "text" },
                { id: "category", label: "Category", renderType: "text" },
                { id: "party", label: "Party", renderType: "text" },
                { id: "director", label: "Director", renderType: "text" },
                { id: "withdrawalAmount", label: "Withdrawal", renderType: "currency", align: "right", isAlwaysPrinted: true },
            ];
        case "transaction": //[cite: 13]
            return [
                { id: "particular", label: "Particular", renderType: "text", isAlwaysPrinted: true },
                { id: "invoiceNumber", label: "Invoice Number", renderType: "text", isAlwaysPrinted: true },
                { id: "date", label: "Date", renderType: "date", isAlwaysPrinted: true },
                { id: "party", label: "Party", renderType: "text" },
                { id: "paymentMethod", label: "Payment Method", renderType: "text" },
                { id: "total", label: "Total", renderType: "currency", align: "right" },
                { id: "debit", label: "Debit", renderType: "currency", align: "right", isAlwaysPrinted: true },
                { id: "credit", label: "Credit", renderType: "currency", align: "right", isAlwaysPrinted: true },
                { id: "balance", label: "Balance", renderType: "currency", align: "right", isAlwaysPrinted: true },
            ];
        case "daily_bank":
            return [
                { id: "date", label: "Date", renderType: "date", isAlwaysPrinted: true },
                { id: "bankName", label: "Bank Name", renderType: "text", isAlwaysPrinted: true },
                { id: "accountNo", label: "Account No", renderType: "text" },
                { id: "openingBalance", label: "Opening Balance", renderType: "currency", align: "right" },
                { id: "deposit", label: "Deposit", renderType: "currency", align: "right", isAlwaysPrinted: true },
                { id: "withdrawal", label: "Withdrawal", renderType: "currency", align: "right", isAlwaysPrinted: true },
                { id: "closingBalance", label: "Closing Balance", renderType: "currency", align: "right", isAlwaysPrinted: true },
            ];
        case "total_bank":
            return [
                { id: "bankName", label: "Bank Name", renderType: "text", isAlwaysPrinted: true },
                { id: "accountType", label: "Account Type", renderType: "text" },
                { id: "accountNo", label: "Account No", renderType: "text", isAlwaysPrinted: true },
                { id: "branch", label: "Branch", renderType: "text" },
                { id: "status", label: "Status", renderType: "badge", align: "center" },
                { id: "currentBalance", label: "Current Balance", renderType: "currency", align: "right", isAlwaysPrinted: true },
            ];
        default:
            return [];
    }
};
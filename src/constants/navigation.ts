export type NavItem = { title: string; href: string };
export type NavSection = { title: string; items: NavItem[] };

const nav = (title: string, items: string[]): NavSection => ({
  title,
  items: items.map((item) => {

    const formattedTitle = title.toLowerCase().replace(/\s+/g, "-");
    const formattedItem = item.toLowerCase().replace(/\s+/g, "-");
    if (title === "Stock Transfer" && item === "Stock Transfers") {
      return {
        title: item,
        href: `/admin/stock-transfers`,
      };
    }

    if (title === "Cash Transfers" && (item === "Cash Transfer" || item === "Cash Transfers")) {
      return {
        title: item,
        href: `/admin/cash-transfers`,
      };
    }

    if (title === "Damage Products" && item === "Damage Products") {
      return {
        title: item,
        href: `/admin/damage-products`,
      };
    }

    if (title === "People" && item === "People") {
      return {
        title: item,
        href: `/admin/people`,
      };
    }

    return {
      title: item,
      href: `/admin/${formattedTitle}/${formattedItem}`,
    };
  }),
});

export const NAVIGATION_DATA: NavSection[] = [
  nav("Products", ["Products", "Used Products", "Categories", "Brands", "Pages", "Attributes", "Specification Groups"]),
  nav("Barcodes", ["Barcode List", "Create Barcode", "Print Barcode", "Barcode History", "Generate Barcode"]),
  nav("Purchases", ["Purchases", "Add Purchase", "Purchase Return", "Add Purchase return"]),
  nav("Sales", ["Sales", "Add Sale", "Sales Return", "Add Sales Return"]),
  nav("Stock Transfer", ["Stock Transfers"]),
  nav("Cash Transfers", ["Cash Transfers"]),
  nav("Damage Products", ["Damage Products"]),
  nav("People", ["People"]),
  nav("Telesales", ["Telesale Report", "Telesale Results"]),
  nav("Order Confirmations", ["Order List", "Order Options"]),
  nav("Payments", ["Add Payment", "Payment List"]),
  nav("Expenses", ["Expenses", "Add Expenses", "Expense Categories", "Add Expense Category"]),
  nav("Withdrawals", ["Withdrawals", "Add Withdrawal", "Director", "Add Director"]),
  nav("Deposit", ["Deposit", "Director", "Add Director"]),
  nav("Directors", ["Directors"]),
  nav("Partners", ["Dealers", "Retailers", "B2B", "Franchises", "Applications"]),
  nav("SEO", ["Salamat"]),
  nav("About Us", ["Tekzo About Us", "Salamat About Us"]),
  nav("Orders", ["All Orders", "Pending Orders", "Hold Order", "Confirm Orders", "Approve Orders", "Processing Orders", "Onway Orders", "Return Orders", "Complete Orders", "Rejected Orders"]),
  nav("Couriers", ["All Courier Orders", "Pathao Orders", "Steadfast Orders", "REDX Orders"]),
  nav("Chat", ["Chat"]),
  nav("Reels Video", ["Reels Video"]),
  nav("Elite", ["Elite"]),
  nav("Popup Dialog", ["Popup Dialog"]),
  nav("Care", ["Care"]),
  nav("Offers", ["Offers"]),
  nav("Media", ["Media"]),
  nav("Coupon", ["Coupon"]),
  nav("News", ["News"]),
  nav("Sliders", ["Sliders"]),
  nav("Gift Product", ["Gift Product"]),
  nav("Warranty", ["Warranty"]),
  nav("Warranty Claim", ["Warranty Claim"]),
  nav("Product Verify", ["Product Verify"]),
  nav("Reviews", ["Reviews"]),
  nav("Sell Device Requests", ["Sell Device Requests"]),
  nav("Our teams", ["Our teams"]),
  nav("EMI Banks", ["EMI Banks"]),
  nav("Careers", ["Careers", "Applicants"]),
  nav("FAQs", ["FAQs"]),
  nav("Blog", ["Blog Posts", "Blog Categories", "Blog Tags"]),
  nav("Outlets", ["Outlets"]),
  nav("Salamat Policy", ["Salamat Policy"]),
  nav("Tekzo Policy", ["Tekzo Policy"]),
  nav("Employee", ["Employee", "Designation", "Employee Status", "Department"]),
  nav("Attendance", ["Attendances", "Attendance Report", "Daily Attendance Log", "Attendance Requests", "Break Time", "Work Shift"]),
  nav("Leaves", ["Leave Type", "Leave Request"]),
  nav("Payroll", ["Beneficiary", "Badge Value", "Payruns", "Payslips"]),
  nav("Assets", ["Asset Category", "Asset"]),
  nav("Holidays", ["Holiday", "Holiday Calendar"]),
  nav("Events", ["Events"]),
  nav("Announcements", ["Announcements"]),
  nav("Ledger", ["Ledger"]),
  nav("Reports", ["Stock", "Profit Loss Report", "Sale", "Sales Return", "Purchase", "Purchase Return", "Stock Transfer", "Cash Transfer", "Damage Product", "Expense", "Deposit Report", "Withdrawal Report", "Transactions"]),
  nav("Daily Closing", ["Daily Closings", "Daily Closing Balance", "Profit Loss", "Balance Sheets", "Stock Statements", "Sale Statements", "Purchase Statements", "Purchase Return Statements", "Sale Return Statements", "Expense Statements", "Withdrawal Statements", "Deposit Statements"]),
  nav("User Roles", ["Users", "Roles"]),
  nav("Settings", ["General Setting", "Payment Method", "Shop", "Ecommerce"]),
];
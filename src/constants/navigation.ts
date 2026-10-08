export type NavItem = { title: string; href: string };
export type NavSection = { title: string; items: NavItem[] };

// Helper function to auto-generate links and keep the file strictly under 100 lines
const nav = (title: string, items: string[]): NavSection => ({
  title,
  items: items.map((item) => {

    if (item === "Products") {
      return { title: item, href: "/admin/products" };
    }
    if (item === "Used Products") {
      return { title: item, href: "/admin/used-product" };
    }

    return {
      title: item,
      href: `/admin/coming-soon?p=${item.toLowerCase().replace(/\s+/g, "-")}`,
    };
  }),
});

export const NAVIGATION_DATA: NavSection[] = [
  nav("Products", ["Products", "Used Products", "Categories", "Brands", "Pages", "Attributes", "Specification Groups"]),
  nav("Barcodes", ["Barcode List"]),
  nav("Purchases", ["Purchases", "Purchase Return"]),
  nav("Sales", ["Sales", "Sales Return", "Stock Transfer"]),
  nav("Cash Transfer", ["Cash Transfer"]),
  nav("Damage Product", ["Damage Product"]),
  nav("People", ["People"]),
  nav("Telesales", ["Telesale Report", "Telesale Results"]),
  nav("Order Confirmations", ["Order List", "Order Options"]),
  nav("Payments", ["Add Payment"]),
  nav("Expenses", ["Expenses", "Expense Categories"]),
  nav("Withdrawal", ["Withdrawal", "Director"]),
  nav("Deposit", ["Deposit", "Director"]),
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
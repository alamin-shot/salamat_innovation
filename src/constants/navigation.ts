export type NavItem = { title: string; href: string };
export type NavSection = { title: string; items: NavItem[] };


const nav = (title: string, items: (string | [string, string])[]): NavSection => ({
  title,
  items: items.map((item) => {
    if (Array.isArray(item)) {
      return { title: item[0], href: item[1] };
    }

    const formattedTitle = title.toLowerCase().replace(/\s+/g, "-");
    const formattedItem = item.toLowerCase().replace(/\s+/g, "-");

    if (items.length === 1) {
      return {
        title: item,
        href: `/admin/${formattedItem}`,
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
  nav("Deposit", ["Deposit", "Add Deposit"]),
  nav("Directors", [["Directors", "/admin/directors/directors"]]),
  nav("Partners", ["Dealers", "Retailers", "B2B", "Franchises", "Applications"]),
  nav("SEO", ["Salamat", "Tekzo"]),
  nav("About Us", ["Tekzo About Us", "Salamat About Us"]),
  nav("Orders", ["All Orders", "Pending Orders", "Hold Order", "Confirm Orders", "Approve Orders", "Processing Orders", "Onway Orders", "Return Orders", "Complete Orders", "Rejected Orders"]),
  nav("Couriers", ["All Couriers Orders", "Pathao Orders", "Steadfast Orders", "REDX Orders"]),
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
  nav("Careers", [
    ["Careers", "/admin/careers"],
    ["Applicants", "/admin/applicants"],
  ]),
  nav("FAQs", ["FAQs"]),
  nav("Blog", [
    ["Blog Posts", "/admin/blog-posts"],
    ["Blog Categories", "/admin/blog-categories"],
    ["Blog Tags", "/admin/blog-tags"],
  ]),
  nav("Outlets", ["Outlets"]),
  nav("Salamat Policy", ["Salamat Policy"]),
  nav("Tekzo Policy", ["Tekzo Policy"]),
  nav("Employee", ["Employees", "Designation", "Employee Status", "Department"]),
  nav("Attendance", ["Attendances", "Attendance Report", "Daily Attendance Log", "Attendance Requests", "Break Time", "Work Shift"]),
  nav("Leaves", ["Leave Type", "Leave Request"]),
  nav("Payroll", ["Beneficiary", "Badge Value", "Payruns", "Payslips"]),
  nav("Assets", ["Assets"]),
  nav("Communications", ["Communications"]),
  nav("Ledger", ["Ledger"]),
  nav("Reports", ["Reports"]),
  nav("Daily Closing", ["Daily Closing"]),
  nav("User Roles", ["Users", "Roles"]),
  nav("Settings", ["Settings"]),
];
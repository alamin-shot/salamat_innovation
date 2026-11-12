import { NavSection } from '@/types/navigation';
import {
	Package,
	ListTree,
	Tags,
	Barcode,
	ScanBarcode,
	PlusCircle,
	Undo2,
	ArrowRightLeft,
	AlertTriangle,
	ShoppingCart,
	ShoppingBag,
	Truck,
	PackageCheck,
	PackageX,
	Users,
	Clock,
	CalendarOff,
	Banknote,
	LineChart,
	Newspaper,
	ShieldAlert,
	ShieldCheck,
	CheckCircle,
	Headphones,
	MessageSquare,
	Briefcase,
	Settings,
	FileText,
	Component,
	LucideIcon,
	Wallet,
	Landmark,
	TicketPercent,
	Images,
	Fingerprint,
	FolderKanban,
	Building2,
	Store,
	Receipt,
	Calculator,
	Scale,
	HelpCircle,
	Layers,
	History,
	CreditCard,
	Send,
	Video,
	Sparkles,
	Gift,
	Star,
	RefreshCw,
	SendHorizonal,
	UserPlus,
	UserCog,
	UserCheck,
	Building,
	Shield,
	Award,
	MessageCircle,
} from 'lucide-react';

const nav = (
	title: string,
	items: (string | [string, LucideIcon] | [string, string, LucideIcon])[],
	defaultIcon: LucideIcon = Component,
): NavSection => ({
	title,
	items: items.map((item) => {
		const formattedTitle = title.toLowerCase().replace(/\s+/g, '-');

		if (Array.isArray(item)) {
			if (item.length === 3) {
				const [itemTitle, href, icon] = item as [string, string, LucideIcon];
				return { title: itemTitle, href, icon };
			} else {
				const [itemTitle, icon] = item as [string, LucideIcon];
				const formattedItem = itemTitle.toLowerCase().replace(/\s+/g, '-');
				const href =
					items.length === 1
						? `/admin/${formattedItem}`
						: `/admin/${formattedTitle}/${formattedItem}`;
				return { title: itemTitle, href, icon };
			}
		}

		const formattedItem = item.toLowerCase().replace(/\s+/g, '-');
		const href =
			items.length === 1
				? `/admin/${formattedItem}`
				: `/admin/${formattedTitle}/${formattedItem}`;
		return { title: item, href, icon: defaultIcon };
	}),
});

export const NAVIGATION_DATA: NavSection[] = [
	nav('Products', [
		['Products', Package],
		['Used Products', RefreshCw],
		['Categories', ListTree],
		['Brands', Tags],
		['Pages', FileText],
		['Attributes', Layers],
		['Specification Groups', FolderKanban],
		['Warranty Care Text', ShieldCheck],
	]),
	nav('Barcodes', [
		['Barcode List', Barcode],
		['Create Barcode', ScanBarcode],
		['Print Barcode', Barcode],
		['Barcode History', History],
		['Generate Barcode', ScanBarcode],
	]),
	nav('Purchases', [
		['Purchases', ShoppingBag],
		['Add Purchase', PlusCircle],
		['Purchase Return', Undo2],
		['Add Purchase return', Undo2],
	]),
	nav('Sales', [
		['Sales', ShoppingCart],
		['Add Sale', PlusCircle],
		['Sales Return', Undo2],
		['Add Sales Return', Undo2],
	]),
	nav('Stock Transfer', [['Stock Transfers', ArrowRightLeft]]),
	nav('Cash Transfers', [['Cash Transfers', ArrowRightLeft]]),
	nav('Damage Products', [['Damage Products', AlertTriangle]]),
	nav('People', [['People', Users]]),
	nav('Telesales', [
		['Telesale Report', LineChart],
		['Telesale Results', CheckCircle],
	]),
	nav('Order Confirmations', [
		['Order List', ShoppingCart],
		['Order Options', Settings],
	]),
	nav('Payments', [
		['Add Payment', PlusCircle],
		['Payment List', CreditCard],
	]),
	nav('Expenses', [
		['Expenses', Receipt],
		['Add Expenses', PlusCircle],
		['Expense Categories', ListTree],
		['Add Expense Category', PlusCircle],
	]),
	nav('Withdrawals', [
		['Withdrawals', Wallet],
		['Add Withdrawal', PlusCircle],
		['Director', Users],
		['Add Director', UserPlus],
	]),
	nav('Deposit', [
		['Deposit', Landmark],
		['Add Deposit', PlusCircle],
	]),
	nav('Directors', [['Directors', '/admin/directors/directors', Users]]),
	nav('Partners', [
		['Dealers', Users],
		['Retailers', Store],
		['B2B', Building2],
		['Franchises', Building],
		['Applications', FileText],
	]),
	nav('SEO', [
		['Salamat', LineChart],
		['Tekzo', LineChart],
	]),
	nav('About Us', [
		['Tekzo About Us', FileText],
		['Salamat About Us', FileText],
	]),
	nav('Orders', [
		['All Orders', ShoppingCart],
		['Pending Orders', Clock],
		['Hold Order', Clock],
		['Confirm Orders', CheckCircle],
		['Approve Orders', CheckCircle],
		['Processing Orders', RefreshCw],
		['Onway Orders', Truck],
		['Return Orders', Undo2],
		['Complete Orders', PackageCheck],
		['Rejected Orders', PackageX],
	]),
	nav('Couriers', [
		['All Couriers Orders', Truck],
		['Pathao Orders', Send],
		['Steadfast Orders', SendHorizonal],
		['REDX Orders', Truck],
	]),
	nav('Chat', [['Chat', MessageCircle]]),
	nav('Reels Video', [['Reels Video', Video]]),
	nav('Elite', [['Elite', Sparkles]]),
	nav('Popup Dialog', [['Popup Dialog', MessageSquare]]),
	nav('Care', [['Care', Headphones]]),
	nav('Offers', [['Offers', TicketPercent]]),
	nav('Media', [['Media', Images]]),
	nav('Coupon', [['Coupon', TicketPercent]]),
	nav('News', [['News', Newspaper]]),
	nav('Sliders', [['Sliders', Images]]),
	nav('Gift Product', [['Gift Product', Gift]]),
	nav('Warranty Claim', [['Warranty Claim', ShieldAlert]]),
	nav('Reviews', [['Reviews', Star]]),
	nav('Sell Device Requests', [['Sell Device Requests', RefreshCw]]),
	nav('Our teams', [['Our teams', Users]]),
	nav('EMI Banks', [['EMI Banks', Landmark]]),
	nav('Careers', [
		['Careers', '/admin/careers', Briefcase],
		['Applicants', '/admin/applicants', Users],
	]),
	nav('FAQs', [['FAQs', HelpCircle]]),
	nav('Blog', [
		['Blog Posts', '/admin/blog-posts', Newspaper],
		['Blog Categories', '/admin/blog-categories', ListTree],
		['Blog Tags', '/admin/blog-tags', Tags],
	]),
	nav('Outlets', [['Outlets', Store]]),
	nav('Salamat Policy', [['Salamat Policy', FileText]]),
	nav('Tekzo Policy', [['Tekzo Policy', FileText]]),
	nav('Employee', [
		['Employees', Users],
		['Designation', UserCog],
		['Employee Status', UserCheck],
		['Department', Building2],
	]),
	nav('Attendance', [
		['Attendances', Fingerprint],
		['Attendance Report', LineChart],
		['Daily Attendance Log', Clock],
		['Attendance Requests', FileText],
		['Break Time', Clock],
		['Work Shift', CalendarOff],
	]),
	nav('Leaves', [
		['Leave Type', ListTree],
		['Leave Request', CalendarOff],
	]),
	nav('Payroll', [
		['Beneficiary', Users],
		['Badge Value', Award],
		['Payruns', FileText],
		['Payslips', Banknote],
	]),
	nav('Assets', [['Assets', Package]]),
	nav('Communications', [['Communications', MessageSquare]]),
	nav('Ledger', [['Ledger', Calculator]]),
	nav('Reports', [['Reports', LineChart]]),
	nav('Integrations', [['Integrations', Settings]]),
	nav('Daily Closing', [['Daily Closing', Scale]]),
	nav('User Roles', [
		['Users', Users],
		['Roles', Shield],
	]),
	nav('Settings', [['Settings', Settings]]),
];

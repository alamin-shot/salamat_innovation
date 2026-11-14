"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { usePeopleStore } from "@/store/usePeopleStore";
import { useGlobalSalesStore } from "@/store/useGlobalSalesStore";
import { useGlobalBarcodesStore } from "@/store/useGlobalBarcodesStore";
import { PersonRecord } from "@/types/people";
import { SaleLineItem, SalePayment, SalesError } from "@/types/sales";
import { PERSON_TYPE_KIND } from "@/constants/people";
import { SALES_LIST_PATH } from "@/constants/sales";
import { computeSaleTotals } from "@/utils/salesMath";
import { lookupSellableUnit } from "@/utils/saleUnits";
import { useSalePayments } from "./useSalePayments";

const SALE_ERRORS: Record<SalesError, string> = {
    customer_required: "Please select a customer.",
    items_required: "Cart is empty.",
    serial_duplicate: "The same serial is in the cart twice.",
    serial_already_returned: "A unit was already returned.",
    customer_mismatch: "Customer mismatch.",
    amount_invalid: "Prices and payments must be 0 or more.",
};

const SALES_ACTOR = "Admin";
const hasAddress = (person: PersonRecord | null) => !!person && person.address.trim() !== "" && person.address !== "-";

/**
 * Add Sale (POS): customer from People (or created on the spot as an Offline Customer), in-stock units
 * scanned from Barcodes, payments, and a real save that also marks each scanned unit as Sold.
 */
export function useAddSaleManager() {
    const router = useRouter();
    const people = usePeopleStore((state) => state.people);
    const addSale = useGlobalSalesStore((state) => state.addSale);
    const barcodes = useGlobalBarcodesStore((state) => state.barcodes);
    const postPayments = useSalePayments();
    const recordSale = useGlobalBarcodesStore((state) => state.recordSale);

    const [customerId, setCustomerId] = useState("");
    const [seller, setSeller] = useState("");
    const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [address, setAddress] = useState("");
    const [items, setItems] = useState<SaleLineItem[]>([]);
    const [scanQuery, setScanQuery] = useState("");
    const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);

    const [orderTaxPct, setOrderTaxPct] = useState<number>(0);
    const [shippingCost, setShippingCost] = useState<number>(0);
    const [additionalChargeName, setAdditionalChargeName] = useState("");
    const [additionalChargeAmount, setAdditionalChargeAmount] = useState<number>(0);
    const [payments, setPayments] = useState<SalePayment[]>([{ id: crypto.randomUUID(), amount: 0, method: "" }]);

    const customers = useMemo(() => people.filter((person) => PERSON_TYPE_KIND[person.type] === "customer"), [people]);
    const customerOptions = useMemo(
        () => [...customers].sort((a, b) => a.name.localeCompare(b.name)).map((person) => ({ value: person.id, label: person.phoneNumber !== "-" ? `${person.name} · ${person.phoneNumber}` : person.name })),
        [customers]
    );
    const customer = customers.find((person) => person.id === customerId) ?? null;

    /** Picking a customer fills the address from their profile (still editable for this sale). */
    const setCustomer = (id: string) => {
        setCustomerId(id);
        const picked = customers.find((person) => person.id === id) ?? null;
        if (hasAddress(picked) && picked) setAddress(picked.address);
    };

    /** POS "Add Customer": the new Offline Customer is selected straight away. */
    const handleCustomerCreated = (person: PersonRecord) => {
        setIsAddCustomerOpen(false);
        setCustomer(person.id);
    };

    const totalsRaw = computeSaleTotals({ items, orderTaxPct, shippingCost, additionalChargeAmount, payments });
    const totals = { ...totalsRaw, totalReceived: totalsRaw.received, dueAmount: totalsRaw.due };
    const stagedItems = items.map((item) => ({ ...item, discount: Math.max(0, item.mrp - item.salePrice) }));

    const scan = () => {
        const result = lookupSellableUnit(barcodes, scanQuery, items);
        if (!result.ok) {
            toast.error(result.message);
            return;
        }
        setItems((prev) => [...prev, result.item]);
        setScanQuery("");
    };

    /** Editing the sale price or the discount keeps sale price + discount = MRP. */
    const handleUpdateItem = (id: string, field: "salePrice" | "discount", value: number) => {
        setItems((prev) => prev.map((item) => {
            if (item.id !== id) return item;
            const salePrice = field === "salePrice" ? value : item.mrp - value;
            return { ...item, salePrice: Math.max(0, salePrice) };
        }));
    };

    const handleRemoveItem = (id: string) => setItems((prev) => prev.filter((item) => item.id !== id));
    const addPaymentMethod = () => setPayments((prev) => [...prev, { id: crypto.randomUUID(), amount: 0, method: "" }]);
    const updatePayment = (id: string, field: "amount" | "method", value: string | number) => {
        setPayments((prev) => prev.map((payment) => (payment.id === id ? { ...payment, [field]: value } : payment)));
    };

    const handleSaveSale = () => {
        if (!customer) return toast.error(SALE_ERRORS.customer_required);
        if (items.length === 0) return toast.error(SALE_ERRORS.items_required);
        if (!seller) return toast.error("Please choose a seller.");
        if (payments.some((payment) => payment.amount > 0 && !payment.method)) return toast.error("Choose a method for every payment.");

        const result = addSale({
            customerId: customer.id,
            customerName: customer.name,
            date, seller, address: address.trim(),
            items, orderTaxPct, shippingCost, additionalChargeName: additionalChargeName.trim(), additionalChargeAmount,
            payments, courier: "Pending",
        });
        if (!result.ok) return toast.error(SALE_ERRORS[result.error]);

        // Money taken at the counter becomes Payment records against this invoice.
        postPayments({ invoiceNumber: result.number, customerId: customer.id, customerName: customer.name, createdAt: new Date().toISOString() }, payments);

        // Each scanned unit leaves stock: Barcodes records the sale against this customer and invoice.
        items.forEach((item) => {
            if (!item.barcodeId) return;
            recordSale(item.barcodeId, { customer: { id: customer.id, name: customer.name, role: "Customer" }, price: item.salePrice, reference: result.number }, SALES_ACTOR);
        });
        toast.success(`Sale ${result.number} saved.`);
        router.push(SALES_LIST_PATH);
    };

    return {
        customer: customerId, setCustomer, customerOptions, selectedCustomer: customer,
        isAddCustomerOpen, openAddCustomer: () => setIsAddCustomerOpen(true), closeAddCustomer: () => setIsAddCustomerOpen(false), handleCustomerCreated,
        seller, setSeller,
        date, setDate,
        address, setAddress,
        scanQuery, setScanQuery, scan,
        stagedItems,
        orderTaxPct, setOrderTaxPct,
        shippingCost, setShippingCost,
        additionalChargeName, setAdditionalChargeName,
        additionalChargeAmount, setAdditionalChargeAmount,
        payments,
        totals,
        handleUpdateItem,
        handleRemoveItem,
        addPaymentMethod,
        updatePayment,
        handleSaveSale,
    };
}

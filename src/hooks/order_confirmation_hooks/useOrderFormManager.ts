"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useOrderListStore, OrderItem } from "./useOrderListStore";
import { useOrderCustomerResolution } from "./useOrderCustomerResolution";

export function useOrderFormManager(
    mode: "create" | "edit",
    initialRecord?: OrderItem | null,
    onClose?: () => void
) {
    const { addOrder, updateOrder } = useOrderListStore();

    // The drawer mounts this form fresh each time it opens, so state starts from the record directly
    // (edit) or from the defaults (create); no effect has to copy values in afterwards.
    const edit = mode === "edit" && initialRecord ? initialRecord : null;

    const [date, setDate] = useState("2026-10-18");
    const [confirmationDate, setConfirmationDate] = useState(edit?.confirmationDate ?? "2026-10-18");
    const [customer, setCustomer] = useState(edit?.customer ?? "");
    const [customerPhone, setCustomerPhone] = useState(edit?.customerPhone ?? "");
    const [product, setProduct] = useState(edit?.product ?? "");
    const [address, setAddress] = useState(edit?.address ?? "");
    const [orderMedia, setOrderMedia] = useState<OrderItem["orderMedia"]>(edit?.orderMedia ?? "WhatsApp");
    const [onlineOffline, setOnlineOffline] = useState<OrderItem["onlineOffline"]>(edit?.onlineOffline ?? "Offline");
    const [orderPerson, setOrderPerson] = useState(edit?.orderPerson ?? "Jannat Ull Naeem Sarah");
    const [advanceMedia, setAdvanceMedia] = useState(edit?.advanceMedia ?? "Bkash 22");
    const [advanceAmount, setAdvanceAmount] = useState<number>(edit?.advanceAmount ?? 120);
    const [sellingPrice, setSellingPrice] = useState<number>(edit?.sellingPrice ?? 6449);
    const [shippingCharge, setShippingCharge] = useState<number>(120);
    const [cod, setCod] = useState<number>(edit?.cod ?? 6449);
    const [note, setNote] = useState(edit?.note ?? "-");
    const [deliveryStatus, setDeliveryStatus] = useState(edit?.deliveryStatus ?? "-");
    const [invoiceNo, setInvoiceNo] = useState(edit?.invoiceNo ?? "-");
    const [deliveryBy, setDeliveryBy] = useState(edit?.deliveryBy ?? "-");
    const [track, setTrack] = useState(edit?.track ?? "-");

    // Customer is resolved from the phone number: a linked profile fills and locks the name (and address).
    const customerResolution = useOrderCustomerResolution(customerPhone, onlineOffline);
    const { linkedCustomer } = customerResolution;
    const resolvedCustomerName = linkedCustomer ? linkedCustomer.name : customer;
    const resolvedAddress = customerResolution.isAddressLocked && linkedCustomer ? linkedCustomer.address : address;

    /** "Add Customer Directly": creates the People profile from the typed name + address. */
    const addCustomerDirectly = () => customerResolution.addCustomerDirectly(customer, address);

    const handleSave = () => {
        if (!linkedCustomer) {
            return toast.error(customerResolution.canAddCustomer
                ? "This phone number has no customer profile yet. Use “Add Customer Directly” first."
                : "Enter the customer's mobile number.");
        }
        if (!product.trim()) return toast.error("Product name is required.");

        const payload = {
            customerId: linkedCustomer.id,
            customer: linkedCustomer.name,
            customerPhone: linkedCustomer.phoneNumber,
            date,
            confirmationDate,
            product: product.trim(),
            address: resolvedAddress || "-",
            orderMedia,
            onlineOffline,
            orderPerson: orderPerson || "-",
            advanceMedia: advanceMedia || "-",
            advanceAmount: Number(advanceAmount) || 0,
            sellingPrice: Number(sellingPrice) || 0,
            cod: Number(cod) || 0,
            note: note || "-",
            deliveryStatus: deliveryStatus || "-",
            invoiceNo: invoiceNo || "-",
            deliveryBy: deliveryBy || "-",
            track: track || "-",
        };

        if (mode === "edit" && initialRecord) {
            updateOrder(initialRecord.id, payload);
            toast.success("Order updated successfully!");
        } else {
            addOrder(payload);
            toast.success("Order created successfully!");
        }

        if (onClose) onClose();
    };

    return {
        date,
        setDate,
        confirmationDate,
        setConfirmationDate,
        customer,
        setCustomer,
        resolvedCustomerName,
        resolvedAddress,
        customerResolution,
        addCustomerDirectly,
        customerPhone,
        setCustomerPhone,
        product,
        setProduct,
        address,
        setAddress,
        orderMedia,
        setOrderMedia,
        onlineOffline,
        setOnlineOffline,
        orderPerson,
        setOrderPerson,
        advanceMedia,
        setAdvanceMedia,
        advanceAmount,
        setAdvanceAmount,
        sellingPrice,
        setSellingPrice,
        shippingCharge,
        setShippingCharge,
        cod,
        setCod,
        note,
        setNote,
        deliveryStatus,
        setDeliveryStatus,
        invoiceNo,
        setInvoiceNo,
        deliveryBy,
        setDeliveryBy,
        track,
        setTrack,
        handleSave,
    };
}
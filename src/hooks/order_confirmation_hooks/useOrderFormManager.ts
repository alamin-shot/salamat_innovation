"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useOrderListStore, OrderItem } from "./useOrderListStore";

export function useOrderFormManager(
    mode: "create" | "edit",
    initialRecord?: OrderItem | null,
    onClose?: () => void
) {
    const { addOrder, updateOrder } = useOrderListStore();

    const [date, setDate] = useState("2026-10-18");
    const [confirmationDate, setConfirmationDate] = useState("2026-10-18");
    const [customer, setCustomer] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [product, setProduct] = useState("");
    const [address, setAddress] = useState("");
    const [orderMedia, setOrderMedia] = useState<OrderItem["orderMedia"]>("WhatsApp");
    const [onlineOffline, setOnlineOffline] = useState<OrderItem["onlineOffline"]>("Offline");
    const [orderPerson, setOrderPerson] = useState("Jannat Ull Naeem Sarah");
    const [advanceMedia, setAdvanceMedia] = useState("Bkash 22");
    const [advanceAmount, setAdvanceAmount] = useState<number>(120);
    const [sellingPrice, setSellingPrice] = useState<number>(6449);
    const [shippingCharge, setShippingCharge] = useState<number>(120);
    const [cod, setCod] = useState<number>(6449);
    const [note, setNote] = useState("-");
    const [deliveryStatus, setDeliveryStatus] = useState("-");
    const [invoiceNo, setInvoiceNo] = useState("-");
    const [deliveryBy, setDeliveryBy] = useState("-");
    const [track, setTrack] = useState("-");

    useEffect(() => {
        if (mode === "edit" && initialRecord) {
            setDate("2026-10-18");
            setConfirmationDate(initialRecord.confirmationDate);
            setCustomer(initialRecord.customer);
            setCustomerPhone(initialRecord.customerPhone);
            setProduct(initialRecord.product);
            setAddress(initialRecord.address);
            setOrderMedia(initialRecord.orderMedia);
            setOnlineOffline(initialRecord.onlineOffline);
            setOrderPerson(initialRecord.orderPerson);
            setAdvanceMedia(initialRecord.advanceMedia);
            setAdvanceAmount(initialRecord.advanceAmount);
            setSellingPrice(initialRecord.sellingPrice);
            setCod(initialRecord.cod);
            setNote(initialRecord.note);
            setDeliveryStatus(initialRecord.deliveryStatus);
            setInvoiceNo(initialRecord.invoiceNo);
            setDeliveryBy(initialRecord.deliveryBy);
            setTrack(initialRecord.track);
        } else if (mode === "create") {
            setCustomer("");
            setCustomerPhone("");
            setProduct("");
            setAddress("");
        }
    }, [mode, initialRecord]);

    const handleSave = () => {
        if (!customer.trim()) return toast.error("Customer name is required.");
        if (!product.trim()) return toast.error("Product name is required.");

        const payload = {
            customer: customer.trim(),
            customerPhone: customerPhone || "01700000000",
            date,
            confirmationDate,
            product: product.trim(),
            address: address || "-",
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
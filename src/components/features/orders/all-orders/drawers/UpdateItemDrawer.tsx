"use client";
import { useState, useEffect } from "react";
import { OrderManagerType } from "@/hooks/order_hooks/useOrderManager";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";

export function UpdateItemDrawer({ manager }: { manager: OrderManagerType }) {
    const order = manager.getActiveOrder();
    // For this prototype, we'll edit the first item in the array
    const item = order?.items[0];

    const [qty, setQty] = useState("");
    const [price, setPrice] = useState("");
    const [discount, setDiscount] = useState("");

    useEffect(() => {
        if (item) {
            setQty(item.quantity.toString());
            setPrice(item.unitPrice.toString());
            setDiscount(item.discount.toString());
        }
    }, [item]);

    if (!order || !item) return null;

    const handleUpdate = () => {
        manager.store.updateOrderItem(order.id, item.id, {
            quantity: parseInt(qty) || 1,
            unitPrice: parseFloat(price) || 0,
            discount: parseFloat(discount) || 0
        });
        manager.closeDrawer();
    };

    return (
        <Drawer
            title="Update Order Item"
            isOpen={manager.activeDrawer === "update-item"}
            onClose={manager.closeDrawer}
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            <div className="flex flex-col h-full">
                <div className="flex flex-col gap-5 flex-1 max-w-2xl mx-auto w-full pt-4">
                    <div className="border border-emerald-200 bg-emerald-50 rounded-lg p-3 text-sm text-emerald-800 flex justify-between items-center cursor-pointer">
                        <span className="font-medium">{item.name} <span className="text-emerald-600/70 ml-2">SKU: {item.sku}</span></span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Product <span className="text-red-500">*</span></label>
                        <input type="text" value={item.name} readOnly className="erp-input bg-gray-50 text-gray-500 cursor-not-allowed" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Quantity <span className="text-red-500">*</span></label>
                            <input type="number" value={qty} onChange={e => setQty(e.target.value)} className="erp-input" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Unit Price <span className="text-red-500">*</span></label>
                            <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="erp-input" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Discount (per unit)</label>
                            <input type="number" value={discount} onChange={e => setDiscount(e.target.value)} className="erp-input" />
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg mt-2 font-medium text-gray-800 flex justify-between items-center border border-gray-100">
                        <span className="text-sm text-gray-600">Line total after discount:</span>
                        <span className="text-lg">৳{((parseInt(qty) * parseFloat(price)) - parseFloat(discount)).toFixed(2)}</span>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 shrink-0 bg-white mt-auto">
                    <Button variant="outline" onClick={manager.closeDrawer} className="px-6 h-9">Cancel</Button>
                    <Button variant="success" onClick={handleUpdate} className="px-8 h-9">Update</Button>
                </div>
            </div>
        </Drawer>
    );
}
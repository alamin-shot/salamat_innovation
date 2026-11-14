import { CustomSelect } from "@/components/ui/CustomSelect";
import { useOrderFormManager } from "@/hooks/order_confirmation_hooks/useOrderFormManager";
import { OrderCustomerSection } from "./OrderCustomerSection";

type Manager = ReturnType<typeof useOrderFormManager>;
type OrderMedia = Manager["orderMedia"];
type OrderChannel = Manager["onlineOffline"];

const MEDIA_OPTIONS: OrderMedia[] = ["WhatsApp", "Messenger", "Phone Call", "-"];
const CHANNEL_OPTIONS: OrderChannel[] = ["Online", "Offline"];
const isMedia = (value: string): value is OrderMedia => MEDIA_OPTIONS.some((option) => option === value);
const isChannel = (value: string): value is OrderChannel => CHANNEL_OPTIONS.some((option) => option === value);

export function OrderFormFields({ manager }: { manager: Manager }) {
    const productOptions = ["Haylou Solar 5", "Galaxy F36 5G", "VOLTME Revo 20", "TOZO S7"];
    const salesmanOptions = ["Jannat Ull Naeem Sarah", "Alamin Rifat"];

    return (
        <div className="flex flex-col gap-2">
            {/* Row 1: Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">
                        Date <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        value={manager.date}
                        onChange={(e) => manager.setDate(e.target.value)}
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-700 focus:border-emerald-500 focus:outline-none h-9"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Confirmation Date</label>
                    <input
                        type="date"
                        value={manager.confirmationDate}
                        onChange={(e) => manager.setConfirmationDate(e.target.value)}
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-700 focus:border-emerald-500 focus:outline-none h-9"
                    />
                </div>
            </div>

            {/* Row 1b: Customer, resolved from the phone number (no dropdown) */}
            <OrderCustomerSection manager={manager} />

            {/* Row 2: Order Media & Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Order Media</label>
                    <CustomSelect
                        value={manager.orderMedia}
                        onChange={(value) => { if (isMedia(value)) manager.setOrderMedia(value); }}
                        options={MEDIA_OPTIONS}
                        placeholder="Choose media"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">
                        Address {manager.customerResolution.isAddressLocked && <span className="text-[11px] font-normal text-emerald-600">(from customer profile)</span>}
                    </label>
                    <textarea
                        rows={2}
                        placeholder="Address"
                        value={manager.resolvedAddress}
                        readOnly={manager.customerResolution.isAddressLocked}
                        onChange={(e) => manager.setAddress(e.target.value)}
                        className={`w-full rounded-md border border-gray-200 p-2.5 text-[13px] text-gray-700 focus:border-emerald-500 focus:outline-none resize-none ${manager.customerResolution.isAddressLocked ? "bg-gray-50 cursor-not-allowed" : "bg-white"}`}
                    />
                </div>
            </div>

            {/* Row 3: Product Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-gray-50/60 p-4 rounded-xl border border-gray-200">
                <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-[13px] font-medium text-gray-600">
                        Product <span className="text-red-500">*</span>
                    </label>
                    <CustomSelect
                        value={manager.product}
                        onChange={manager.setProduct}
                        options={productOptions}
                        placeholder="Choose a product"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Quantity</label>
                    <input
                        type="number"
                        defaultValue={1}
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-700 focus:border-emerald-500 focus:outline-none h-9"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Selling Price</label>
                    <input
                        type="number"
                        value={manager.sellingPrice}
                        onChange={(e) => manager.setSellingPrice(Number(e.target.value))}
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-700 focus:border-emerald-500 focus:outline-none h-9"
                    />
                </div>
            </div>

            {/* Row 4: Online/Offline, Order Person, Advance Media */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Online / Offline</label>
                    <CustomSelect
                        value={manager.onlineOffline}
                        onChange={(value) => { if (isChannel(value)) manager.setOnlineOffline(value); }}
                        options={CHANNEL_OPTIONS}
                        placeholder="Select type"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Order Person</label>
                    <CustomSelect
                        value={manager.orderPerson}
                        onChange={manager.setOrderPerson}
                        options={salesmanOptions}
                        placeholder="Choose a salesman"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Advance Media</label>
                    <CustomSelect
                        value={manager.advanceMedia}
                        onChange={manager.setAdvanceMedia}
                        options={["Bkash 22", "Bkash 24", "Nagad 25", "SSL", "-"]}
                        placeholder="Advance Media"
                    />
                </div>
            </div>

            {/* Row 5: Amounts & Note */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Advance Amount</label>
                    <input
                        type="number"
                        value={manager.advanceAmount}
                        onChange={(e) => manager.setAdvanceAmount(Number(e.target.value))}
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-700 focus:border-emerald-500 focus:outline-none h-9"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Shipping Charge</label>
                    <input
                        type="number"
                        value={manager.shippingCharge}
                        onChange={(e) => manager.setShippingCharge(Number(e.target.value))}
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-700 focus:border-emerald-500 focus:outline-none h-9"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">COD</label>
                    <input
                        type="number"
                        value={manager.cod}
                        onChange={(e) => manager.setCod(Number(e.target.value))}
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-700 focus:border-emerald-500 focus:outline-none h-9"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Note</label>
                    <input
                        type="text"
                        value={manager.note}
                        onChange={(e) => manager.setNote(e.target.value)}
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-700 focus:border-emerald-500 focus:outline-none h-9"
                    />
                </div>
            </div>
        </div>
    );
}
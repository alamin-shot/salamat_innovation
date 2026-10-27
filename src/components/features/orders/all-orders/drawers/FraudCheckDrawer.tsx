"use client";
import { OrderManagerType } from "@/hooks/order_hooks/useOrderManager";
import { Drawer } from "@/components/ui/Drawer";

export function FraudCheckDrawer({ manager }: { manager: OrderManagerType }) {
    const order = manager.getActiveOrder();
    if (!order) return null;

    const { fraudMetrics: metrics } = order;

    return (
        <Drawer
            title={`Fraud Check - ${order.customerName}`}
            isOpen={manager.activeDrawer === "fraud"}
            onClose={manager.closeDrawer}
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-emerald-200 bg-emerald-50/30 rounded-xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                        <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Genuine Probability</span>
                        <div className="text-3xl font-black text-emerald-600 mt-2">{metrics.genuineProbability}%</div>
                    </div>
                    <div className="border border-red-200 bg-red-50/30 rounded-xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
                        <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider">Fraud Probability</span>
                        <div className="text-3xl font-black text-red-600 mt-2">{metrics.fraudProbability}%</div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 pb-2">Courier Breakdown</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {metrics.couriers.map((courier, idx) => (
                            <div key={idx} className="erp-card p-4 flex flex-col gap-3 border border-gray-100 shadow-sm">
                                <div className="font-bold text-gray-800 text-sm">{courier.name}</div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500">Success</span>
                                        <span className="font-semibold text-emerald-600">{courier.success}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${(courier.success / (courier.success + courier.cancelled || 1)) * 100}%` }}></div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500">Cancelled</span>
                                        <span className="font-semibold text-red-600">{courier.cancelled}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                                        <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${(courier.cancelled / (courier.success + courier.cancelled || 1)) * 100}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Drawer>
    );
}
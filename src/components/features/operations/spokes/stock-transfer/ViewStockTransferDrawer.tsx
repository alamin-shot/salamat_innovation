import * as React from "react";
import { useReactToPrint } from "react-to-print";
import { Drawer } from "@/components/ui/Drawer";
import { StockTransfer } from "@/types/stockTransfers";
import { OperationApprovalStatus } from "@/types/operations";
import { OperationDecisionBar } from "../../shared/OperationDecisionBar";
import { OperationInfoTile } from "../../shared/OperationInfoTile";
import { OperationSerialsTable } from "../../shared/OperationSerialsTable";

interface ViewStockTransferDrawerProps {
    transfer: StockTransfer | null;
    isOpen: boolean;
    onClose: () => void;
    onDecide: (id: string, status: Exclude<OperationApprovalStatus, "Draft">) => void;
}

export function ViewStockTransferDrawer({ transfer, isOpen, onClose, onDecide }: ViewStockTransferDrawerProps) {
    const printRef = React.useRef<HTMLDivElement>(null);
    const print = useReactToPrint({ contentRef: printRef, documentTitle: transfer?.ref ?? "Stock_Transfer" });

    return (
        <Drawer title="Stock Transfer Detail" isOpen={isOpen} onClose={onClose} width="w-full sm:w-[calc(100vw-260px)]">
            {transfer && (
                <div className="pb-32">
                    <div ref={printRef} className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 sm:p-7 flex flex-col gap-5">
                        <OperationDecisionBar refNo={transfer.ref} status={transfer.status} onPrint={() => print()} onDecide={(status) => onDecide(transfer.id, status)} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                            <OperationInfoTile label="From Shop" value={transfer.fromShop} />
                            <OperationInfoTile label="To Shop" value={transfer.toShop} />
                            <OperationInfoTile label="Transfer Date" value={transfer.date} />
                            <OperationInfoTile label="Created By" value={transfer.createdBy} />
                            <OperationInfoTile label={transfer.status === "Cancelled" ? "Cancelled By" : "Approved By"} value={transfer.approvedBy ?? "Pending approval"} highlight={transfer.status === "Approved"} />
                        </div>
                        {transfer.note && <p className="rounded-lg border border-gray-100 bg-gray-50/50 p-3 text-[13px] text-gray-600"><span className="font-semibold">Note:</span> {transfer.note}</p>}
                        <OperationSerialsTable title="Transfer Serials" serials={transfer.serials} />
                    </div>
                </div>
            )}
        </Drawer>
    );
}

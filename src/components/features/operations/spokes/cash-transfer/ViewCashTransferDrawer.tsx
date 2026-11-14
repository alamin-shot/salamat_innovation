import * as React from "react";
import { useReactToPrint } from "react-to-print";
import { Drawer } from "@/components/ui/Drawer";
import { CashTransfer } from "@/types/cashTransfers";
import { OperationApprovalStatus } from "@/types/operations";
import { formatOperationTimestamp } from "@/utils/operationsRules";
import { OperationDecisionBar } from "../../shared/OperationDecisionBar";
import { OperationInfoTile } from "../../shared/OperationInfoTile";
import { formatTaka } from "./formatTaka";

interface ViewCashTransferDrawerProps {
    transfer: CashTransfer | null;
    isOpen: boolean;
    onClose: () => void;
    onDecide: (id: string, status: Exclude<OperationApprovalStatus, "Draft">) => void;
}

export function ViewCashTransferDrawer({ transfer, isOpen, onClose, onDecide }: ViewCashTransferDrawerProps) {
    const printRef = React.useRef<HTMLDivElement>(null);
    const print = useReactToPrint({ contentRef: printRef, documentTitle: transfer?.ref ?? "Cash_Transfer" });

    return (
        <Drawer title="Cash Transfer Detail" isOpen={isOpen} onClose={onClose} width="w-full sm:w-[calc(100vw-260px)]">
            {transfer && (
                <div className="pb-32">
                    <div ref={printRef} className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 sm:p-7 flex flex-col gap-5">
                        <OperationDecisionBar refNo={transfer.ref} status={transfer.status} onPrint={() => print()} onDecide={(status) => onDecide(transfer.id, status)} />
                        <div className="flex flex-col items-center justify-center p-6 rounded-lg border border-emerald-200 bg-emerald-50/60 w-full gap-1">
                            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">Transfer Amount</span>
                            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 tracking-tight">{formatTaka(transfer.amount)}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            <OperationInfoTile label="From Shop" value={transfer.fromShop} />
                            <OperationInfoTile label="To Shop" value={transfer.toShop} />
                            <OperationInfoTile label="Transfer Date" value={transfer.date} />
                            <OperationInfoTile label="Created At" value={formatOperationTimestamp(transfer.createdAt)} />
                            <OperationInfoTile label="Created By" value={transfer.createdBy} />
                            <OperationInfoTile label={transfer.status === "Cancelled" ? "Cancelled By" : "Approved By"} value={transfer.approvedBy ?? "Pending approval"} highlight={transfer.status === "Approved"} />
                        </div>
                        {transfer.note && <p className="rounded-lg border border-gray-100 bg-gray-50/50 p-3 text-[13px] text-gray-600"><span className="font-semibold">Note:</span> {transfer.note}</p>}
                    </div>
                </div>
            )}
        </Drawer>
    );
}

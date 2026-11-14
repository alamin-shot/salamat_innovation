import * as React from "react";
import { useReactToPrint } from "react-to-print";
import { Drawer } from "@/components/ui/Drawer";
import { Badge } from "@/components/ui/Badge";
import { DamageProduct } from "@/types/damageProducts";
import { OperationApprovalStatus } from "@/types/operations";
import { OperationDecisionBar } from "../../shared/OperationDecisionBar";
import { OperationInfoTile } from "../../shared/OperationInfoTile";
import { OperationSerialsTable } from "../../shared/OperationSerialsTable";

interface ViewDamageProductDrawerProps {
    record: DamageProduct | null;
    isOpen: boolean;
    onClose: () => void;
    onDecide: (id: string, status: Exclude<OperationApprovalStatus, "Draft">) => void;
}

export function ViewDamageProductDrawer({ record, isOpen, onClose, onDecide }: ViewDamageProductDrawerProps) {
    const printRef = React.useRef<HTMLDivElement>(null);
    const print = useReactToPrint({ contentRef: printRef, documentTitle: record?.ref ?? "Damage_Record" });

    return (
        <Drawer title="Damage Product Detail" isOpen={isOpen} onClose={onClose} width="w-full sm:w-[calc(100vw-260px)]">
            {record && (
                <div className="pb-32">
                    <div ref={printRef} className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 sm:p-7 flex flex-col gap-5">
                        <OperationDecisionBar refNo={record.ref} status={record.status} onPrint={() => print()} onDecide={(status) => onDecide(record.id, status)} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            <OperationInfoTile label="Shop" value={record.shop} />
                            <OperationInfoTile label="Damage Date" value={record.date} />
                            <OperationInfoTile label="Created By" value={record.createdBy} />
                            <OperationInfoTile label={record.status === "Cancelled" ? "Cancelled By" : "Approved By"} value={record.approvedBy ?? "Pending approval"} highlight={record.status === "Approved"} />
                        </div>
                        {record.note && <p className="rounded-lg border border-gray-100 bg-gray-50/50 p-3 text-[13px] text-gray-600"><span className="font-semibold">Reason:</span> {record.note}</p>}
                        <OperationSerialsTable
                            title="Damaged Serials"
                            serials={record.serials}
                            extraColumn={{ label: "Status", render: (serial) => <Badge variant="success">{serial.stockStatus}</Badge> }}
                        />
                    </div>
                </div>
            )}
        </Drawer>
    );
}

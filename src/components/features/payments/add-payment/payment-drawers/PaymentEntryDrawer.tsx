import { CheckCircle2 } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { usePaymentFormManager } from "@/hooks/finance_hooks/payments/usePaymentFormManager";
import { PaymentPartyRow } from "@/types/payments";
import { PaymentFormFields } from "./PaymentFormFields";

type Direction = "receive" | "send";

function PaymentEntryForm({ direction, record, onClose }: { direction: Direction; record: PaymentPartyRow; onClose: () => void }) {
    const manager = usePaymentFormManager(direction, record, onClose);

    return (
        <div className="min-h-full bg-gray-50/50 p-4 pb-32 sm:p-6">
            <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
                <PaymentFormFields manager={manager} record={record} />
                <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                    <Button type="button" variant="outline" onClick={onClose} className="px-6">Cancel</Button>
                    <Button type="button" variant="success" onClick={manager.handleSave} className="px-6">
                        <CheckCircle2 className="mr-1.5 h-4 w-4" /> {direction === "receive" ? "Receive Payment" : "Send Payment"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

/** Receive (money in) or Send (money out) for one person; the form remounts per person + direction. */
export function PaymentEntryDrawer({ direction, record, isOpen, onClose }: { direction: Direction; record: PaymentPartyRow | null; isOpen: boolean; onClose: () => void }) {
    const role = record?.type === "Supplier" ? "Supplier" : "Customer";
    const title = `${direction === "receive" ? "Receive" : "Send"} Payment · ${role}`;

    return (
        <Drawer title={title} isOpen={isOpen} onClose={onClose} width="w-full sm:w-[calc(100vw-260px)]">
            {record && <PaymentEntryForm key={`${direction}-${record.id}`} direction={direction} record={record} onClose={onClose} />}
        </Drawer>
    );
}

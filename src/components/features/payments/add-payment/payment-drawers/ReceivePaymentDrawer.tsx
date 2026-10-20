import { CheckCircle2 } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { usePaymentFormManager } from "@/hooks/finance_hooks/payments/usePaymentFormManager";
import { PaymentFormFields } from "./PaymentFormFields";
import { PaymentEntity } from "@/hooks/finance_hooks/payments/useAddPaymentStore";

export function ReceivePaymentDrawer({
    record,
    isOpen,
    onClose,
}: {
    record: PaymentEntity | null;
    isOpen: boolean;
    onClose: () => void;
}) {
    const manager = usePaymentFormManager("receive", record?.id || null, onClose);

    if (!isOpen) return null;

    return (
        <Drawer title="Customer Payment" isOpen={isOpen} onClose={onClose} width="w-full max-w-lg">
            <div className="p-4 sm:p-6 bg-gray-50/50 min-h-full pb-12">
                <div className="flex flex-col gap-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <PaymentFormFields manager={manager} record={record} bannerType="Customer" />
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <Button type="button" variant="outline" onClick={onClose} className="px-6">Cancel</Button>
                        <Button type="button" variant="success" onClick={manager.handleSave} className="px-6">
                            <CheckCircle2 className="h-4 w-4 mr-1.5" /> Save
                        </Button>
                    </div>
                </div>
            </div>
        </Drawer>
    );
}
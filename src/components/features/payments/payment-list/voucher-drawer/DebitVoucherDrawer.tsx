import { Printer } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { DebitVoucherTemplate } from "./DebitVoucherTemplate";
import { PaymentLog } from "@/hooks/finance_hooks/usePaymentListStore";

export function DebitVoucherDrawer({
    record,
    isOpen,
    onClose,
}: {
    record: PaymentLog | null;
    isOpen: boolean;
    onClose: () => void;
}) {
    if (!isOpen || !record) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <Drawer title={`Voucher: ${record.invoiceNumber}`} isOpen={isOpen} onClose={onClose} width="w-full max-w-none lg:w-[calc(100vw-280px)]">
            <div className="p-4 sm:p-6 lg:p-12 bg-gray-200 min-h-full pb-20">

                {/* Print Control Bar */}
                <div className="max-w-3xl mx-auto mb-4 flex justify-end">
                    <Button type="button" variant="outline" onClick={handlePrint} className="bg-white border-gray-300 shadow-sm gap-2">
                        <Printer className="h-4 w-4" /> Print Voucher
                    </Button>
                </div>

                <div className="print-section">
                    <DebitVoucherTemplate record={record} />
                </div>
            </div>

            {/* Print Styles (Global overrides applied only during printing) */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .print-section, .print-section * {
                        visibility: visible;
                    }
                    .print-section {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        background: white !important;
                    }
                }
            `}} />
        </Drawer>
    );
}
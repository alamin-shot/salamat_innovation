import * as React from "react";
import { Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { usePeopleStore } from "@/store/usePeopleStore";
import { PaymentListRow } from "@/types/payments";
import { DebitVoucherTemplate } from "./DebitVoucherTemplate";

/** Voucher for one Payment record; prints only the voucher. */
export function DebitVoucherDrawer({ record, isOpen, onClose }: { record: PaymentListRow | null; isOpen: boolean; onClose: () => void }) {
    const printRef = React.useRef<HTMLDivElement>(null);
    const party = usePeopleStore((state) => state.people.find((person) => person.id === record?.personId) ?? null);
    const handlePrint = useReactToPrint({ contentRef: printRef, documentTitle: `Voucher_${record?.number ?? "preview"}` });

    return (
        <Drawer title={record ? `Voucher: ${record.number}` : "Voucher"} isOpen={isOpen} onClose={onClose} width="w-full sm:w-[calc(100vw-260px)]">
            {record && (
                <div className="min-h-full bg-gray-200 p-4 pb-32 sm:p-6 lg:p-12">
                    <div className="mx-auto mb-4 flex max-w-3xl justify-end">
                        <Button type="button" variant="outline" onClick={() => handlePrint()} className="gap-2 border-gray-300 bg-white shadow-sm">
                            <Printer className="h-4 w-4" /> Print Voucher
                        </Button>
                    </div>
                    <DebitVoucherTemplate ref={printRef} record={record} party={party} />
                </div>
            )}
        </Drawer>
    );
}

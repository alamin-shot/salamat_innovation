import { toast } from "sonner";
import { OperationsActionResult, OperationsCreateResult } from "@/types/operations";
import { OPERATIONS_ERROR_MESSAGES } from "@/constants/operations";

/** Shows the toast for an Operations store result; returns true when it succeeded. */
export function notifyOperationResult(result: OperationsActionResult | OperationsCreateResult, success: string): boolean {
    if (!result.ok) {
        toast.error(OPERATIONS_ERROR_MESSAGES[result.error]);
        return false;
    }
    toast.success(success);
    return true;
}

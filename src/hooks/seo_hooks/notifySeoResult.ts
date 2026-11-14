import { toast } from "sonner";
import { SeoConfigResult } from "@/types/seo";
import { SEO_CONFIG_ERROR_MESSAGES } from "@/constants/seo";

/** Toast for a SEO config save; returns true on success. */
export function notifySeoResult(result: SeoConfigResult, success: string): boolean {
    if (!result.ok) {
        toast.error(SEO_CONFIG_ERROR_MESSAGES[result.error]);
        return false;
    }
    toast.success(success);
    return true;
}

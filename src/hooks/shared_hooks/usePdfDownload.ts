import { useState } from "react";
import type { ReactElement } from "react";
import type { DocumentProps } from "@react-pdf/renderer";
import { toast } from "sonner";

/**
 * One-click .pdf download. The PDF engine and the document are loaded only when clicked, so they
 * never weigh on page load or run on the server.
 */
export function usePdfDownload() {
    const [isGenerating, setIsGenerating] = useState(false);

    const download = async (fileName: string, buildDocument: () => Promise<ReactElement<DocumentProps>>) => {
        if (isGenerating) return;
        setIsGenerating(true);
        try {
            const [{ pdf }, { registerPdfFonts }] = await Promise.all([
                import("@react-pdf/renderer"),
                import("@/components/shared/pdf/pdfTheme"),
            ]);
            registerPdfFonts(window.location.origin);
            const blob = await pdf(await buildDocument()).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
        } catch {
            toast.error("The PDF could not be created. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    return { download, isGenerating };
}

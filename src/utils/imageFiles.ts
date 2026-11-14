// Browser-side image intake for uploads that are stored before a media service exists.

export type ImageReadError = "not_image" | "too_large" | "unreadable";

/**
 * Reads an image file, scales it so its longest edge is at most `maxEdge`, and returns a compact
 * data URL (keeps the persisted store small). Rejects with an ImageReadError code.
 */
export function readImageAsDataUrl(file: File, maxEdge: number, maxBytes: number): Promise<string> {
    if (!file.type.startsWith("image/")) return Promise.reject<string>("not_image" satisfies ImageReadError);
    if (file.size > maxBytes) return Promise.reject<string>("too_large" satisfies ImageReadError);

    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const image = new Image();
        image.onload = () => {
            const scale = Math.min(1, maxEdge / Math.max(image.width, image.height));
            const canvas = document.createElement("canvas");
            canvas.width = Math.max(1, Math.round(image.width * scale));
            canvas.height = Math.max(1, Math.round(image.height * scale));
            const context = canvas.getContext("2d");
            URL.revokeObjectURL(url);
            if (!context) return reject("unreadable" satisfies ImageReadError);
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            // PNG keeps logo transparency; photos are smaller as JPEG.
            resolve(file.type === "image/png" ? canvas.toDataURL("image/png") : canvas.toDataURL("image/jpeg", 0.85));
        };
        image.onerror = () => {
            URL.revokeObjectURL(url);
            reject("unreadable" satisfies ImageReadError);
        };
        image.src = url;
    });
}

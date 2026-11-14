import { Star } from "lucide-react";

/** Read-only stars (rating 0–5, partial ratings fill to the nearest whole star). */
export function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
    const box = size === "lg" ? "h-5 w-5" : "h-3.5 w-3.5";
    return (
        <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={`${box} ${star <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-100 text-gray-200"}`} />
            ))}
        </div>
    );
}

/** Clickable 1–5 star picker. */
export function StarRatingInput({ value, onChange }: { value: number; onChange: (value: number) => void }) {
    const labels = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];
    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" role="radio" aria-checked={value === star} onClick={() => onChange(star)} title={`${star} star${star > 1 ? "s" : ""}`} className="rounded p-0.5 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-300">
                        <Star className={`h-7 w-7 ${star <= value ? "fill-amber-400 text-amber-400" : "fill-gray-100 text-gray-300"}`} />
                    </button>
                ))}
            </div>
            <span className="text-sm font-medium text-gray-600">{value ? labels[value] : "Choose a rating"}</span>
        </div>
    );
}

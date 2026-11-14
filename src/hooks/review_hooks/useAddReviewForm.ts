import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useReviewStore } from "@/store/useReviewStore";
import { useGlobalProductsStore } from "@/store/useGlobalProductsStore";
import { useGlobalSalesStore } from "@/store/useGlobalSalesStore";
import { usePeopleStore } from "@/store/usePeopleStore";
import { ReviewStatus } from "@/types/reviews";
import { PERSON_TYPE_KIND } from "@/constants/people";
import { PEOPLE_IMAGE_MAX_BYTES, PEOPLE_IMAGE_MAX_EDGE } from "@/constants/people";
import { REVIEW_ERRORS, REVIEW_MAX_PHOTOS, REVIEW_STATUSES } from "@/constants/reviews";
import { ImageReadError, readImageAsDataUrl } from "@/utils/imageFiles";
import { isVerifiedBuyer } from "@/utils/reviewRules";

const IMAGE_ERRORS: Record<ImageReadError, string> = {
    not_image: "Please choose image files.",
    too_large: "Each photo must be 2MB or smaller.",
    unreadable: "A photo could not be read.",
};

/** Add Review: product from Products, customer from People customers, stars, comment, status, photos. */
export function useAddReviewForm(onSaved: () => void) {
    const addReview = useReviewStore((state) => state.addReview);
    const products = useGlobalProductsStore((state) => state.products);
    const people = usePeopleStore((state) => state.people);
    const sales = useGlobalSalesStore((state) => state.sales);

    const [productId, setProductId] = useState("");
    const [customerId, setCustomerId] = useState("");
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [status, setStatusState] = useState<ReviewStatus>("Pending");
    const [photos, setPhotos] = useState<string[]>([]);

    const productOptions = useMemo(() => products.map((product) => ({ value: product.id, label: product.name })), [products]);
    const customerOptions = useMemo(() => people
        .filter((person) => PERSON_TYPE_KIND[person.type] === "customer")
        .map((person) => ({ value: person.id, label: person.phoneNumber !== "-" ? `${person.name} · ${person.phoneNumber}` : person.name })), [people]);

    const product = products.find((candidate) => candidate.id === productId) ?? null;
    const customer = people.find((candidate) => candidate.id === customerId) ?? null;
    const verified = !!product && !!customer && isVerifiedBuyer({ customerId: customer.id, customerName: customer.name, productName: product.name }, sales);

    const addPhotos = (files: FileList | null) => {
        const picked = Array.from(files ?? []).slice(0, REVIEW_MAX_PHOTOS - photos.length);
        if (files && files.length > picked.length) toast.info(`Up to ${REVIEW_MAX_PHOTOS} photos per review.`);
        picked.forEach((file) => {
            readImageAsDataUrl(file, PEOPLE_IMAGE_MAX_EDGE, PEOPLE_IMAGE_MAX_BYTES)
                .then((url) => setPhotos((prev) => (prev.length < REVIEW_MAX_PHOTOS ? [...prev, url] : prev)))
                .catch((code: ImageReadError) => toast.error(IMAGE_ERRORS[code] ?? IMAGE_ERRORS.unreadable));
        });
    };

    const save = () => {
        const result = addReview({
            productId: product?.id ?? null,
            productName: product?.name ?? "",
            customerId: customer?.id ?? null,
            customerName: customer?.name ?? "",
            rating,
            comment,
            status,
            photos,
        });
        if (!result.ok) return toast.error(REVIEW_ERRORS[result.error]);
        toast.success("Review added.");
        onSaved();
    };

    return {
        productId, setProductId, productOptions,
        customerId, setCustomerId, customerOptions,
        rating, setRating,
        comment, setComment,
        status, setStatus: (value: string) => setStatusState(REVIEW_STATUSES.find((option) => option === value) ?? status),
        photos, addPhotos, removePhoto: (index: number) => setPhotos((prev) => prev.filter((_, i) => i !== index)),
        verified,
        save,
    };
}

export type AddReviewForm = ReturnType<typeof useAddReviewForm>;

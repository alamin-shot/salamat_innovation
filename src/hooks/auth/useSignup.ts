import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signupSchema, type SignupFormData } from "@/validations/auth.schema";
import { useToast } from "@/components/shared/toast/ToastContext";

export function useSignup() {
    const router = useRouter();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: { name: "", email: "", password: "" },
    });

    const onSubmit = async (data: SignupFormData) => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            showToast("Account created! Please verify your email.", "success");
            router.push("/otp");
        }, 1000);
    };

    return { form, isLoading, onSubmit };
}
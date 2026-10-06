import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/validations/auth.schema";
import { authService } from "@/services/auth.service";
import { useToast } from "@/components/shared/toast/ToastContext";

export function useForgotPassword() {
    const router = useRouter();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" },
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setIsLoading(true);
        try {
            await authService.requestOtp(data.email);
            showToast("OTP sent to your email!", "success");
            router.push("/otp");
        } catch (error) {
            showToast("Failed to send OTP", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return { form, isLoading, onSubmit };
}
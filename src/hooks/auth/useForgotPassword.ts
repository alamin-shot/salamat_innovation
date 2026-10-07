import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/validations/auth.schema";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";

export function useForgotPassword() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" },
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setIsLoading(true);
        try {
            await authService.requestOtp(data.email);
            toast.success("OTP sent to your email!");
            router.push("/otp");
        } catch (error) {
            toast.error("Failed to send OTP");
        } finally {
            setIsLoading(false);
        }
    };

    return { form, isLoading, onSubmit };
}
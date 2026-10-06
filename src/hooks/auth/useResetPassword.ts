import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/validations/auth.schema";
import { useToast } from "@/components/shared/toast/ToastContext";

export function useResetPassword() {
    const router = useRouter();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { password: "", confirmPassword: "" },
    });

    const onSubmit = async (data: ResetPasswordFormData) => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            showToast("Password reset successfully! Please login.", "success");
            router.push("/login");
        }, 1000);
    };

    return { form, isLoading, onSubmit };
}
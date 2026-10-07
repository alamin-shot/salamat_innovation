import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/validations/auth.schema";
import { toast } from "sonner";

export function useResetPassword() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { password: "", confirmPassword: "" },
    });

    const onSubmit = async (data: ResetPasswordFormData) => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            toast.success("Password reset successfully! Please login.");
            router.push("/login");
        }, 1000);
    };

    return { form, isLoading, onSubmit };
}
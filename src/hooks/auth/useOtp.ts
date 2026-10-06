import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { otpSchema, type OtpFormData } from "@/validations/auth.schema";
import { authService } from "@/services/auth.service";
import { useToast } from "@/components/shared/toast/ToastContext";

export function useOtp() {
    const router = useRouter();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<OtpFormData>({
        resolver: zodResolver(otpSchema),
        defaultValues: { otp: "" },
    });

    const onSubmit = async (data: OtpFormData) => {
        setIsLoading(true);
        try {
            await authService.verifyOtp(data.otp);
            showToast("OTP verified successfully!", "success");
            router.push("/reset-password");
        } catch (error: any) {
            showToast(error.message || "Invalid OTP code", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return { form, isLoading, onSubmit };
}
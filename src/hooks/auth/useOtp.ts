import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { otpSchema, type OtpFormData } from "@/validations/auth.schema";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";

export function useOtp() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<OtpFormData>({
        resolver: zodResolver(otpSchema),
        defaultValues: { otp: "" },
    });

    const onSubmit = async (data: OtpFormData) => {
        setIsLoading(true);
        try {
            await authService.verifyOtp(data.otp);
            toast.success("OTP verified successfully!");
            router.push("/reset-password");
        } catch (error: any) {
            toast.error(error.message || "Invalid OTP code");
        } finally {
            setIsLoading(false);
        }
    };

    return { form, isLoading, onSubmit };
}
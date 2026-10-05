"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { otpSchema, type OtpFormData } from "@/validations/auth.schema";
import { authService } from "@/services/auth.service";
import { useToast } from "@/components/shared/toast/ToastContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormMessage } from "@/components/shared/form/Form";

export default function OtpPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);

    const form = useForm<OtpFormData>({
        resolver: zodResolver(otpSchema),
        defaultValues: { otp: "" },
    });

    const onSubmit = async (data: OtpFormData) => {
        setIsLoading(true);
        try {
            // Mock valid OTP is "123456" as set in our auth.service.ts
            await authService.verifyOtp(data.otp);
            showToast("OTP verified successfully!", "success");
            // Proceed to reset password (or dashboard if from signup)
            router.push("/reset-password");
        } catch (error: any) {
            showToast(error.message || "Invalid OTP code", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-brand-bg p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                <h1 className="mb-2 text-2xl font-bold text-brand-text">Verify OTP</h1>
                <p className="mb-8 text-sm text-brand-subtext">Enter the 6-digit code sent to you. (Hint: 123456)</p>

                <Form form={form} onSubmit={onSubmit}>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-brand-text">Secure Code</label>
                        <Input
                            type="text"
                            maxLength={6}
                            placeholder="123456"
                            className="text-center tracking-[0.5em] text-lg font-bold"
                            {...form.register("otp")}
                            disabled={isLoading}
                        />
                        <FormMessage name="otp" />
                    </div>
                    <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                        {isLoading ? "Verifying..." : "Verify Code"}
                    </Button>
                </Form>
            </div>
        </div>
    );
}
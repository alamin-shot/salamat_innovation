"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/validations/auth.schema";
import { authService } from "@/services/auth.service";
import { useToast } from "@/components/shared/toast/ToastContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormMessage } from "@/components/shared/form/Form";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);

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

    return (
        <div className="flex min-h-screen items-center justify-center bg-brand-bg p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                <h1 className="mb-2 text-2xl font-bold text-brand-text">Reset Password</h1>
                <p className="mb-8 text-sm text-brand-subtext">Enter your email to receive an OTP.</p>

                <Form form={form} onSubmit={onSubmit}>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-brand-text">Email Address</label>
                        <Input type="email" placeholder="admin@email.com" {...form.register("email")} disabled={isLoading} />
                        <FormMessage name="email" />
                    </div>
                    <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                        {isLoading ? "Sending..." : "Send OTP"}
                    </Button>
                </Form>
                <div className="mt-6 text-center">
                    <Link href="/login" className="text-sm font-medium text-brand-primary hover:underline">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { resetPasswordSchema, type ResetPasswordFormData } from "@/validations/auth.schema";
import { useToast } from "@/components/shared/toast/ToastContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormMessage } from "@/components/shared/form/Form";

export default function ResetPasswordPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);

    const form = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { password: "", confirmPassword: "" },
    });

    const onSubmit = async (data: ResetPasswordFormData) => {
        setIsLoading(true);
        // Simulating the password reset API call
        setTimeout(() => {
            setIsLoading(false);
            showToast("Password reset successfully! Please login.", "success");
            router.push("/login");
        }, 1000);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-brand-bg p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                <h1 className="mb-2 text-2xl font-bold text-brand-text">Set New Password</h1>
                <p className="mb-8 text-sm text-brand-subtext">Must be at least 8 characters long.</p>

                <Form form={form} onSubmit={onSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-brand-text">New Password</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                {...form.register("password")}
                                disabled={isLoading}
                            />
                            <FormMessage name="password" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-brand-text">Confirm Password</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                {...form.register("confirmPassword")}
                                disabled={isLoading}
                            />
                            <FormMessage name="confirmPassword" />
                        </div>
                    </div>
                    <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Reset Password"}
                    </Button>
                </Form>
            </div>
        </div>
    );
}
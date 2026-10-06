"use client";
import * as React from "react";
import Link from "next/link";
import { useForgotPassword } from "@/hooks/auth/useForgotPassword";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormMessage } from "@/components/shared/form/Form";

export default function ForgotPasswordPage() {
    const { form, isLoading, onSubmit } = useForgotPassword();

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
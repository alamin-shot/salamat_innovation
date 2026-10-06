"use client";
import * as React from "react";
import { useOtp } from "@/hooks/auth/useOtp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormMessage } from "@/components/shared/form/Form";

export default function OtpPage() {
    const { form, isLoading, onSubmit } = useOtp();

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
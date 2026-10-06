"use client";
import * as React from "react";
import Link from "next/link";
import { useSignup } from "@/hooks/auth/useSignup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormMessage } from "@/components/shared/form/Form";

export default function SignupPage() {
    const { form, isLoading, onSubmit } = useSignup();

    return (
        <div className="flex min-h-screen items-center justify-center bg-brand-bg p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                <h1 className="mb-2 text-2xl font-bold text-brand-text">Create Account</h1>
                <p className="mb-8 text-sm text-brand-subtext">Join Salamat Innovation</p>

                <Form form={form} onSubmit={onSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-brand-text">Full Name</label>
                            <Input placeholder="John Doe" {...form.register("name")} disabled={isLoading} />
                            <FormMessage name="name" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-brand-text">Email Address</label>
                            <Input type="email" placeholder="admin@email.com" {...form.register("email")} disabled={isLoading} />
                            <FormMessage name="email" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-brand-text">Password</label>
                            <Input type="password" placeholder="••••••••" {...form.register("password")} disabled={isLoading} />
                            <FormMessage name="password" />
                        </div>
                    </div>
                    <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                        {isLoading ? "Creating..." : "Sign Up"}
                    </Button>
                </Form>
                <p className="mt-6 text-center text-sm text-brand-subtext">
                    Already have an account?{" "}
                    <Link href="/login" className="font-medium text-brand-primary hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}
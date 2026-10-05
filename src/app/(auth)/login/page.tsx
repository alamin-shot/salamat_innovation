"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { loginSchema, type LoginFormData } from "@/validations/auth.schema";
import { authService } from "@/services/auth.service";
import { setCredentials } from "@/store/slices/auth.slice";
import { useToast } from "@/components/shared/toast/ToastContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormMessage } from "@/components/shared/form/Form";

export default function LoginPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        try {
            // Calls the mock service (1-second delay)
            const result = await authService.login(data);
            dispatch(setCredentials(result));
            showToast("Login successful!", "success");

            // Redirect to the massive Admin Layout we just built
            router.push("/admin");
        } catch (error: any) {
            showToast(error.message || "Invalid credentials", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-brand-bg p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-text font-bold text-brand-primary">
                        SI
                    </div>
                    <h1 className="text-2xl font-bold text-brand-text">Welcome Back</h1>
                    <p className="text-sm text-brand-subtext">Sign in to Salamat Innovation</p>
                </div>

                <Form form={form} onSubmit={onSubmit}>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-brand-text">Email Address</label>
                        <Input
                            type="email"
                            placeholder="admin@email.com"
                            {...form.register("email")}
                            disabled={isLoading}
                        />
                        <FormMessage name="email" />
                    </div>

                    <div className="space-y-1 mt-4">
                        <label className="text-sm font-medium text-brand-text">Password</label>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            {...form.register("password")}
                            disabled={isLoading}
                        />
                        <FormMessage name="password" />
                    </div>

                    <div className="flex items-center justify-end mt-2">
                        <Link
                            href="/forgot-password"
                            className="text-xs font-medium text-brand-primary hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                        {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                </Form>
            </div>
        </div>
    );
}
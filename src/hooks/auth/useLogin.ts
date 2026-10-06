import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import { loginSchema, type LoginFormData } from "@/validations/auth.schema";
import { authService } from "@/services/auth.service";
import { setCredentials } from "@/store/slices/auth.slice";
import { useToast } from "@/components/shared/toast/ToastContext";

export function useLogin() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        try {
            const result = await authService.login(data);
            dispatch(setCredentials(result));
            showToast("Login successful!", "success");
            router.push("/admin");
        } catch (error: any) {
            showToast(error.message || "Invalid credentials", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return { form, isLoading, onSubmit };
}
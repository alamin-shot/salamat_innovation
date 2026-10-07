import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import { loginSchema, type LoginFormData } from "@/validations/auth.schema";
import { authService } from "@/services/auth.service";
import { setCredentials } from "@/store/slices/auth.slice";
import { toast } from "sonner";

export function useLogin() {
    const dispatch = useDispatch();
    const router = useRouter();

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
            toast.success("Login successful!");
            router.push("/admin");
        } catch (error: any) {
            toast.error(error.message || "Invalid credentials");
        } finally {
            setIsLoading(false);
        }
    };

    return { form, isLoading, onSubmit };
}
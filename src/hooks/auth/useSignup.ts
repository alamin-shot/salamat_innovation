import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signupSchema, type SignupFormData } from "@/validations/auth.schema";
import { toast } from "sonner";

export function useSignup() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: { name: "", email: "", password: "" },
    });

    const onSubmit = async (data: SignupFormData) => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            toast.success("Account created! Please verify your email.");
            router.push("/otp");
        }, 1000);
    };

    return { form, isLoading, onSubmit };
}
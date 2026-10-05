"use client";
import * as React from "react";
import { FormProvider, useFormContext, UseFormReturn, FieldValues, SubmitHandler } from "react-hook-form";
import { cn } from "@/lib/utils";

interface FormProps<T extends FieldValues> extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
}

export function Form<T extends FieldValues>({ form, onSubmit, children, className, ...props }: FormProps<T>) {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-4", className)} {...props}>
        {children}
      </form>
    </FormProvider>
  );
}

export function FormMessage({ name }: { name: string }) {
  const { formState: { errors } } = useFormContext();
  const error = errors[name];
  if (!error) return null;
  return <p className="text-sm font-medium text-red-500 mt-1">{String(error.message)}</p>;
}

import * as React from "react";

export interface BaseInputProps {
    label?: string;
    error?: string;
    helperText?: string;
}

export interface FormInputProps
    extends React.InputHTMLAttributes<HTMLInputElement>, BaseInputProps { }

export interface SelectOption {
    label: string;
    value: string | number;
}

export interface FormSelectProps
    extends React.SelectHTMLAttributes<HTMLSelectElement>, BaseInputProps {
    options: SelectOption[];
    placeholder?: string;
}

export interface FormToggleProps
    extends React.InputHTMLAttributes<HTMLInputElement>, BaseInputProps { }
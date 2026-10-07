export interface RichTextEditorProps {
    label?: string;
    error?: string;
    helperText?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}
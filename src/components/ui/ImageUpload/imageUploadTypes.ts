export interface ImageUploadProps {
    value?: string;
    onChange: (imageUrl: string | null) => void;
    onError?: (message: string) => void;
    placeholder?: string;
    className?: string;
}
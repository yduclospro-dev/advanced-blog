export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
export const MAX_FILE_SIZE_MB = 5;

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export const isValidImageDataUrl = (url: string): boolean => {
    if (!url) return false;

    const dataUrlRegex = /^data:image\/(jpeg|png|gif|webp);base64,/i;
    return dataUrlRegex.test(url);
};

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return {
            isValid: false,
            error: 'Veuillez sélectionner un fichier image valide (JPEG, PNG, GIF, WebP).'
        };
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
        return {
            isValid: false,
            error: `L'image doit faire moins de ${MAX_FILE_SIZE_MB}MB.`
        };
    }

    return { isValid: true };
};

export const isQuotaExceededError = (error: unknown): boolean => {
    return error instanceof DOMException && (
        error.code === 22 ||
        error.code === 1014 ||
        error.name === 'QuotaExceededError' ||
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    );
};
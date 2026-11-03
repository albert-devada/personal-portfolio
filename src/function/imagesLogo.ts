/**
 * Normalizes an image/logo URL.
 * If empty or null, returns the fallback image URL provided in parameter.
 */
export const getLogoSrc = (src: string | null | undefined, fallback: string = "/certificate.jpg", prefix?: string): string => {
    if (!src) return fallback;

    if (src.startsWith("http://")) {
        return src.replace("http://", "https://");
    }
    
    if (src.startsWith("https://") || src.startsWith("/")) {
        return src;
    }
    
    if (prefix) {
        const cleanPrefix = prefix.endsWith("/") ? prefix.slice(0, -1) : prefix;
        return `${cleanPrefix}/${src}`;
    }

    return `/${src}`;
};
export const getAvatarSrc = (src: string | null | undefined): string => {
    if (!src) return "/assets/avatar.jpeg";

    if (src.startsWith("http://")) {
        return src.replace("http://", "https://");
    }
    
    if (src.startsWith("https://") || src.startsWith("/")) {
        return src;
    }
    
    return `/${src}`;
};

export const formatDisplayUsername = (username?: string | null): string => {
    const cleanUser = username?.split("@").filter(Boolean).pop();
    return cleanUser ? `@${cleanUser}` : "@";
};

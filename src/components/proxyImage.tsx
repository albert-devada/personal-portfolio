"use client";

import { getApiUrl } from "@/lib/api";
import { useState } from "react";
import Image, { ImageProps } from "next/image";

const DEFAULT_FALLBACK = "/covernews.jpg";

interface ProxyImageProps extends Omit<ImageProps, "src" | "alt"> {
    src?: string | null;
    alt: string;
    fallbackImage?: string;
}

function resolveImageUrl(src?: string | null, fallback: string = DEFAULT_FALLBACK): string {
    if (!src || src.trim() === "") return fallback;

    let cleaned = src;
    if (cleaned.startsWith("http://")) {
        cleaned = cleaned.replace("http://", "https://");
    }

    if (cleaned.startsWith("https://")) {
        return `${getApiUrl("/api/image")}?url=${encodeURIComponent(cleaned)}`;
    }

    if (cleaned.startsWith("/")) {
        return cleaned;
    }

    return `/${cleaned}`;
}

export function ProxyImage({src, alt, fallbackImage = DEFAULT_FALLBACK, className, fill, width, height, sizes, ...props}: ProxyImageProps) {
    const [hasError, setHasError] = useState(false);
    const [prevSrc, setPrevSrc] = useState(src);

    if (src !== prevSrc) {
        setPrevSrc(src);
        setHasError(false);
    }

    const resolvedUrl = resolveImageUrl(src, fallbackImage);
    const currentSrc = hasError ? fallbackImage : resolvedUrl;
    const isFallback = currentSrc === fallbackImage;

    return (
        <Image
            {...props}
            src={currentSrc}
            alt={alt}
            fill={fill}
            sizes={sizes || (fill ? "100vw" : undefined)}
            width={!fill ? width : undefined}
            height={!fill ? height : undefined}
            className={className}
            unoptimized={!isFallback}
            onError={() => {
                if (!hasError) {
                    setHasError(true);
                }
            }}
        />
    );
}
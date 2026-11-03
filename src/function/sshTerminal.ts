import type { CertificationRawItem, CertificateItem } from "@/common/types";

/**
 * Automatically scrolls the nearest scrollable parent container to the bottom.
 * Returns a cleanup function that cancels the requestAnimationFrame and timer.
 */
export function scrollTerminalToBottom(element: HTMLElement | null, delayMs: number = 100): () => void {
    if (!element) return () => {};

    let timer: ReturnType<typeof setTimeout> | null = null;
    const frameId = requestAnimationFrame(() => {
        timer = setTimeout(() => {
            let parent = element?.parentElement;

            while (parent) {
                const style = window.getComputedStyle(parent);
                const isScrollable = style.overflowY === "auto" || style.overflowY === "scroll";

                if (isScrollable && parent.scrollHeight > parent.clientHeight) {
                    parent.scrollTo({
                        top: parent.scrollHeight,
                        behavior: "smooth",
                    });
                    break;
                }
                parent = parent.parentElement;
            }
        }, delayMs);
    });

    return () => {
        cancelAnimationFrame(frameId);
        if (timer) clearTimeout(timer);
    };
}

/**
 * Formats raw certificate data from Supabase into display-ready CertificateItem array.
 */
export const formatCertificateData = (data: CertificationRawItem[]): CertificateItem[] => {
    return (data || []).slice(0, 5).reverse().map((cert, index) => {
        const title = String(cert.title ?? "");
        const vendor = String(cert.vendor ?? "");
        const credential = cert.credential ? String(cert.credential) : "";
        const url = typeof cert.href_url === "string" ? cert.href_url : null;
        return {
            id: String(index + 1),
            title,
            path: credential ? `${vendor} (${credential})` : vendor,
            url,
            borderColor: "border-zinc-700",
        };
    });
};

/**
 * Formats usernames into capitalized clean display names.
 */
export const formatOperatorNickname = (str?: string): string => {
    if (!str) return "";
    return str.replace(/^@/, "").replace(/[_-]/g, " ").split(" ").filter(Boolean).map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
};

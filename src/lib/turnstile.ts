import { getVisitorDetails } from "@/common/service/locationVisitor";

export async function VerifedTurnstileToken(token?: string | null, overrideIp?: string): Promise<boolean> {

    if (!token || typeof token !== "string" || !token.trim() || token === "undefined" || token === "null") {
        return false;
    }

    const secretKey = process.env.TURNSTILE_SECRET_KEY;
    
    if (!secretKey) {
        console.error("[Turnstile Error] TURNSTILE_SECRET_KEY missing in environment variables.");
        return false;
    }

    try {
        let clientIp = overrideIp;
        if (!clientIp) {
            const visitor = await getVisitorDetails(false);
            clientIp = visitor?.ipAddress;
        }

        const formData = new URLSearchParams();
        formData.append("secret", secretKey);
        formData.append("response", token.trim());

        if (clientIp) {
            formData.append("remoteip", clientIp);
        }

        const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData.toString(),
            cache: "no-store",
        });

        if (!response.ok) {
            console.error(`[Turnstile Error] HTTP Status: ${response.status}`);
            return false;
        }

        const outcome = await response.json();
        return outcome.success === true;
    } catch (error) {
        console.error("[Turnstile Verification Exception]:", error);
        return false;
    }
}
import { cookies } from "next/headers";

export interface PortfolioSessionPayload {
    refresh_token: string;
    expires_at: number;
    is_anonymous: boolean;
}

const SECRET_KEY_RAW = process.env.APP_KEY || "albertdevada__portfolio_secret_key_64bytes";

export async function getCryptoKey(): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(SECRET_KEY_RAW);
    const hash = await crypto.subtle.digest("SHA-256", keyData);
    return await crypto.subtle.importKey(
        "raw",
        hash,
        { name: "AES-GCM" },
        false,
        ["encrypt", "decrypt"],
    );
}

export async function decryptSession(
    base64Data: string,
    cryptoKey: CryptoKey,
): Promise<PortfolioSessionPayload | null> {
    try {
        const combined = Buffer.from(base64Data, "base64");
        if (combined.length < 13) return null;

        const iv = combined.slice(0, 12);
        const ciphertext = combined.slice(12);
        const decryptedBuffer = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv },
            cryptoKey,
            ciphertext,
        );
        return JSON.parse(
            new TextDecoder().decode(decryptedBuffer),
        ) as PortfolioSessionPayload;
    } catch {
        return null;
    }
}

export async function VerifedSession(): Promise<PortfolioSessionPayload | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("portfolio_session")?.value;
    if (!sessionCookie) return null;

    const cryptoKey = await getCryptoKey();
    const payload = await decryptSession(sessionCookie, cryptoKey);

    if (!payload || payload.expires_at < Math.floor(Date.now() / 1000)) {
        return null;
    }

    return payload;
}

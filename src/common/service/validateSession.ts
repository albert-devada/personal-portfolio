import { cookies } from "next/headers";
import { getCryptoKey, decryptSession } from "@/utils/encryption";
import type { PortfolioSessionPayload } from "@/common/types";

export { getCryptoKey, decryptSession };

export async function ValidateSession(): Promise<PortfolioSessionPayload | null> {
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
import { Config } from "@/common/config";
import type { PortfolioSessionPayload } from "@/common/types";

let cachedCryptoKey: CryptoKey | null = null;

export async function getCryptoKey(): Promise<CryptoKey> {
    if (cachedCryptoKey) return cachedCryptoKey;
    const encoder = new TextEncoder();
    const keyData = encoder.encode(Config.AppKeys);
    const hash = await crypto.subtle.digest("SHA-256", keyData);
    cachedCryptoKey = await crypto.subtle.importKey("raw", hash, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
    return cachedCryptoKey;
}

export async function encryptSession(data: PortfolioSessionPayload, cryptoKey: CryptoKey): Promise<string> {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(JSON.stringify(data));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedBuffer = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, cryptoKey, encodedData);
    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encryptedBuffer), iv.length);
    return Buffer.from(combined).toString("base64url");
}

export async function decryptSession(base64Data: string, cryptoKey: CryptoKey): Promise<PortfolioSessionPayload | null> {
    try {
        const combined = Buffer.from(base64Data, "base64url");
        if (combined.length < 13) return null;
        const iv = combined.slice(0, 12);
        const ciphertext = combined.slice(12);
        const decryptedBuffer = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, cryptoKey, ciphertext);
        return JSON.parse(new TextDecoder().decode(decryptedBuffer)) as PortfolioSessionPayload;
    } catch {
        return null;
    }
}
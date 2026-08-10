interface RateLimitRecord {
    count: number;
    resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupStore() {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;

    lastCleanup = now;
    for (const [key, record] of rateLimitStore.entries()) {
        if (now > record.resetTime) {
            rateLimitStore.delete(key);
        }
    }
}

export interface RateLimitResponse {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
}

/**
 * Checks rate limit for a given identifier (e.g. IP address).
 * @param identifier Client IP address or unique key
 * @param limit Max allowed requests per window (default: 60)
 * @param windowMs Time window in milliseconds (default: 60,000ms = 1 minute)
 */
export function checkRateLimit(identifier: string, limit: number = 60, windowMs: number = 60000): RateLimitResponse {
    cleanupStore();
    const now = Date.now();
    const key = identifier || "unknown_client";
    const record = rateLimitStore.get(key);

    if (!record || now > record.resetTime) {
        const resetTime = now + windowMs;
        rateLimitStore.set(key, { count: 1, resetTime });
        return { success: true, limit, remaining: limit - 1, reset: Math.ceil((resetTime - now) / 1000) };
    }

    if (record.count >= limit) {
        return { success: false, limit, remaining: 0, reset: Math.ceil((record.resetTime - now) / 1000) };
    }

    record.count += 1;
    return { success: true, limit, remaining: limit - record.count, reset: Math.ceil((record.resetTime - now) / 1000) };
}
